import { Injectable } from '@nestjs/common';
import { Role } from '@workspace/data';

@Injectable()
export class PermissionService {
  private roleHierarchy = {
    [Role.OWNER]: 3,
    [Role.ADMIN]: 2,
    [Role.VIEWER]: 1,
  };

  hasPermission(userRole: Role, requiredRole: Role): boolean {
    return this.roleHierarchy[userRole] >= this.roleHierarchy[requiredRole];
  }

  canAccessOrganization(
    userOrgId: string,
    targetOrgId: string,
    userRole: Role,
    orgHierarchy: Map<string, string> // orgId -> parentOrgId
  ): boolean {
    // OWNER can access their org and child orgs
    if (userRole === Role.OWNER) {
      if (userOrgId === targetOrgId) return true;
      // Check if target is child of user's org
      const parentId = orgHierarchy.get(targetOrgId);
      return parentId === userOrgId;
    }
    
    // ADMIN and VIEWER can only access their own org
    return userOrgId === targetOrgId;
  }
}
