import { RBACGuard } from './rbac.guard';
import { PermissionService } from './permission.service';
import { Reflector } from '@nestjs/core';
import { Role } from '@workspace/data';

describe('RBACGuard', () => {
  let guard: RBACGuard;
  let permissionService: PermissionService;
  let reflector: Reflector;

  beforeEach(() => {
    permissionService = new PermissionService();
    reflector = new Reflector();
    guard = new RBACGuard(reflector, permissionService);
  });

  it('should allow owner to access admin routes', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(Role.ADMIN);
    
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: Role.OWNER } }),
      }),
      getHandler: () => ({}),
    };

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny viewer access to admin routes', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(Role.ADMIN);
    
    const context: any = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: Role.VIEWER } }),
      }),
      getHandler: () => ({}),
    };

    expect(() => guard.canActivate(context)).toThrow();
  });
});
