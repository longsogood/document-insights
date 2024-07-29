'''
File này giúp tiết kiệm thời gian khi tạo các lớp mô hình cho cơ sở dữ liệu 
'''
from sqlalchemy import Column, DateTime, UUID # định nghĩa các cột trong bảng
from sqlalchemy.sql import func # để gọi các hàm sql có sẵn như 'uuid_generate_v4()' và 'now()'
from sqlalchemy.ext.declarative import as_declarative, declared_attr # được dùng để tạo lớp cơ sở và thuộc tính được khai báo

@as_declarative() # định nghĩa lớp cơ sở
class Base:
    # các cột mặc định trong lớp cơ sở
    
    # id: cột này là khóa chính và được lập chỉ mục, sử dụng kiểu dữ liệu UUID và giá trị mặc định được tạo ra bởi hàm uuid_generate_v4() trong PostgreSQL
    id = Column(UUID, primary_key=True, index=True, default=func.uuid_generate_v4())

    # created_at: Cột này lưu trữ thời điểm tạo bản ghi, với giá trị mặc địch là thời gian hiện tại sử dụng func.now()
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # updated_at: Cột này lưu trữ thời điểm cập nhật bản ghi, với giá trị mặc định là thời gian hiện tại và tự động cập nhật mỗi khi bản ghi được cập nhật
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __name__: str

    # Generate __tablename__ automatically
    @declared_attr # được sử dụng để định nghĩa một thuộc tính của lớp thay vì của instance. Thuộc tính này tự động tạo tên bảng bằng cách tên của lớp
    
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
