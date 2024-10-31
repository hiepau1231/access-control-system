import { AppDataSource } from '../config/database';

const resetDatabase = async () => {
  try {
    // Đảm bảo connection được đóng
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }

    // Khởi tạo lại connection với force sync
    await AppDataSource.initialize();
    
    // Drop tất cả các bảng
    await AppDataSource.synchronize(true);
    
    console.log('Database has been reset successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();