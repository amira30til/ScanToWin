import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../modules/admins/entities/admin.entity';

@Injectable()
export class SuperAdminSeed implements OnApplicationBootstrap {
  constructor(private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    const adminRepo = this.dataSource.getRepository(Admin);
    const email = process.env.SUPER_ADMIN_EMAIL;

    const existingAdmin = await adminRepo.findOne({
      where: { email, role: 'SUPER_ADMIN' },
    });

    if (!existingAdmin) {
      const password = process.env.SUPER_ADMIN_PASSWORD;
      if (!email || !password) {
        throw new Error('Missing email or password');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAdmin = adminRepo.create({
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      });
      await adminRepo.save(newAdmin);
      console.log('✅ Super admin created');
    } else {
      console.log('ℹ️ Super admin already exists');
    }
  }
}
