export enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  VIEWER = 'viewer',
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  role: Role;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrganization {
  id: string;
  name: string;
  parentOrgId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
  ownerId: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
}
