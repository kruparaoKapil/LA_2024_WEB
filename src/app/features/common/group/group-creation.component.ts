import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import {
  GroupMember,
  GroupRoleOption,
  GroupService,
} from '../group.service';
import { AuthStore } from '../../../core/auth/auth.store';
import { ToastService } from '../../../core/notifications/toast.service';
import { LoaderService } from '../../../core/loader/loader.service';
import {
  DataGridComponent,
  DataGridColumn,
  SelectComponent,
} from '../../../shared/ui';

/**
 * Create / edit a group with its members. Replaces legacy
 * `UI/Common/group-creation/group-creation.component`.
 *
 * Notes vs. legacy implementation:
 *  - Reactive forms collapsed to signals + plain `ngModel`. The legacy
 *    `FormArray` + `BlurEventAllControll` was 200+ LOC of manual
 *    error-state plumbing — replaced by a tiny `errors` computed that
 *    recomputes whenever any signal it depends on changes.
 *  - Member picking still routes through a Phase 7 `<app-contact-select>`
 *    dialog. Until that lands, members can be entered inline (name +
 *    role) so this screen is usable today and the data shape is
 *    stable.
 */
@Component({
  selector: 'app-group-creation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DataGridComponent,
    SelectComponent,
  ],
  template: `
    <div class="page">
      <p-card>
        <ng-template pTemplate="header">
          <div class="card-head">
            <h2>{{ editing() ? 'Edit Group' : 'New Group' }}</h2>
            <p-button
              label="Back"
              icon="pi pi-arrow-left"
              severity="secondary"
              [outlined]="true"
              (onClick)="back()"
            />
          </div>
        </ng-template>

        <div class="grid">
          <div class="field">
            <label>Group Code</label>
            <input
              pInputText
              [ngModel]="code()"
              (ngModelChange)="code.set($event)"
            />
            @if (errors().code) {
              <small class="err">{{ errors().code }}</small>
            }
          </div>
          <div class="field">
            <label>Group Name</label>
            <input
              pInputText
              [ngModel]="name()"
              (ngModelChange)="name.set($event)"
            />
            @if (errors().name) {
              <small class="err">{{ errors().name }}</small>
            }
          </div>
          <div class="field">
            <label>Group Type</label>
            <input
              pInputText
              [ngModel]="type()"
              (ngModelChange)="type.set($event)"
            />
          </div>
        </div>

        <div class="member-section">
          <h3>Members</h3>
          <div class="member-form">
            <input
              pInputText
              placeholder="Member name"
              [ngModel]="newMemberName()"
              (ngModelChange)="newMemberName.set($event)"
            />
            <app-select
              [options]="roles()"
              optionLabel="pRoleInGroup"
              optionValue="pGrouproleID"
              [ngModel]="newMemberRole()"
              (ngModelChange)="newMemberRole.set($event)"
              placeholder="Role…"
            />
            <p-button
              label="Add"
              icon="pi pi-plus"
              [disabled]="!canAddMember()"
              (onClick)="addMember()"
            />
          </div>

          <app-data-grid
            [rows]="memberRows()"
            [columns]="memberColumns"
            [showSearch]="false"
            [showExportExcel]="false"
            [showExportPdf]="false"
            [paginator]="false"
            exportFilename="group-members"
          />
        </div>

        <ng-template pTemplate="footer">
          <div class="footer">
            <p-button
              [label]="cancelLabel()"
              severity="secondary"
              [outlined]="true"
              (onClick)="back()"
            />
            <p-button
              [label]="saveLabel()"
              icon="pi pi-check"
              [loading]="busy()"
              [disabled]="busy() || !canSave()"
              (onClick)="save()"
            />
          </div>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 1100px;
        margin-inline: auto;
      }
      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
      }
      .card-head h2 {
        margin: 0;
      }
      .grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr 1fr 1fr;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .err {
        color: var(--p-red-500);
      }
      .member-section {
        margin-top: 1.5rem;
      }
      .member-section h3 {
        margin-top: 0;
      }
      .member-form {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .footer {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
      }
    `,
  ],
})
export class GroupCreationComponent {
  private readonly groupSvc = inject(GroupService);
  private readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastService);
  private readonly loader = inject(LoaderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // ---- form state ----
  protected readonly code = signal<string>('');
  protected readonly name = signal<string>('');
  protected readonly type = signal<string>('');
  protected readonly members = signal<GroupMember[]>([]);
  protected readonly editing = signal<boolean>(false);
  protected readonly editingId = signal<number>(0);
  protected readonly busy = signal<boolean>(false);

  protected readonly roles = signal<GroupRoleOption[]>([]);

  // member-add row
  protected readonly newMemberName = signal<string>('');
  protected readonly newMemberRole = signal<number | null>(null);

  protected readonly memberColumns: DataGridColumn<GroupMember>[] = [
    { field: 'pContactName', header: 'Member', filter: false },
    { field: 'pRoleInGroup', header: 'Role', filter: false, width: '200px' },
    {
      field: 'pTypeofOperation',
      header: 'State',
      filter: false,
      width: '120px',
      align: 'center',
    },
  ];

  protected readonly memberRows = computed(() =>
    this.members().filter((m) => m.pTypeofOperation !== 'delete'),
  );

  protected readonly errors = computed(() => ({
    code: this.code().trim() ? '' : 'Group code is required.',
    name: this.name().trim() ? '' : 'Group name is required.',
  }));

  protected readonly canSave = computed(
    () => !this.errors().code && !this.errors().name,
  );

  protected readonly canAddMember = computed(
    () => this.newMemberName().trim().length > 0 && !!this.newMemberRole(),
  );

  protected readonly saveLabel = computed(() =>
    this.editing() ? 'Update' : 'Save',
  );
  protected readonly cancelLabel = computed(() => 'Cancel');

  constructor() {
    this.loadRoles();
    this.tryLoadFromRoute();
  }

  private loadRoles(): void {
    this.groupSvc.getRoles().subscribe({
      next: (list) => this.roles.set(list ?? []),
    });
  }

  private tryLoadFromRoute(): void {
    const idParam = this.route.snapshot.params['id'];
    if (!idParam) return;
    let decoded: number;
    try {
      decoded = Number(atob(idParam));
    } catch {
      decoded = Number(idParam);
    }
    if (!Number.isFinite(decoded) || decoded <= 0) return;
    this.editing.set(true);
    this.editingId.set(decoded);
    this.loader.show('Loading group…');
    this.groupSvc.getGroupForEdit(decoded).subscribe({
      next: (resp) => {
        const data = Array.isArray(resp) ? resp[0] : resp;
        if (!data) {
          this.loader.hide();
          return;
        }
        const d = data as Record<string, unknown>;
        this.code.set(String(d['pGroupCode'] ?? ''));
        this.name.set(String(d['pGroupName'] ?? ''));
        this.type.set(String(d['pGroupType'] ?? ''));
        const list = (d['pListGroupDetails'] as GroupMember[] | undefined) ?? [];
        this.members.set(list);
        this.loader.hide();
      },
      error: () => this.loader.hide(),
    });
  }

  protected addMember(): void {
    if (!this.canAddMember()) return;
    const role = this.roles().find(
      (r) => r.pGrouproleID === this.newMemberRole(),
    );
    this.members.update((list) => [
      ...list,
      {
        pContactID: 0,
        pMemberId: 0,
        pContactName: this.newMemberName().trim(),
        pGrouproleID: this.newMemberRole()!,
        pRoleInGroup: role?.pRoleInGroup,
        pTypeofOperation: 'create',
      },
    ]);
    this.newMemberName.set('');
    this.newMemberRole.set(null);
  }

  protected save(): void {
    if (!this.canSave()) {
      this.toast.warn('Fix the highlighted fields before saving.');
      return;
    }
    this.busy.set(true);
    this.loader.show(this.editing() ? 'Updating…' : 'Saving…');
    const payload = {
      pGroupID: this.editingId() || undefined,
      pGroupCode: this.code().trim(),
      pGroupName: this.name().trim(),
      pGroupType: this.type().trim() || undefined,
      pCreatedby: Number(this.auth.currentUserId()) || 0,
      pTypeofoperation: this.editing() ? ('UPDATE' as const) : ('CREATE' as const),
      pListGroupDetails: this.members(),
    };
    const op = this.editing()
      ? this.groupSvc.updateGroupDetails(payload)
      : this.groupSvc.saveGroupConfig(payload);
    op.subscribe({
      next: () => {
        this.busy.set(false);
        this.loader.hide();
        this.toast.success(
          this.editing() ? 'Group updated.' : 'Group created.',
        );
        void this.router.navigate(['/common/GroupView']);
      },
      error: () => {
        this.busy.set(false);
        this.loader.hide();
      },
    });
  }

  protected back(): void {
    void this.router.navigate(['/common/GroupView']);
  }
}
