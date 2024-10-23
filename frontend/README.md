# Frontend Documentation

## Sử dụng Tailwind CSS

Dự án này sử dụng Tailwind CSS để styling. Dưới đây là một số quy ước và hướng dẫn:

1. Sử dụng các utility classes của Tailwind trực tiếp trong JSX.
2. Đối với các styles phức tạp hoặc lặp lại, tạo các custom classes trong file `src/styles/global.css`.
3. Sử dụng các breakpoints của Tailwind để làm responsive design: sm, md, lg, xl.
4. Tuân thủ theme colors đã định nghĩa trong `tailwind.config.js`.

## Custom Components

Dự án có một số custom components được xây dựng dựa trên Ant Design và Tailwind:

- Button: `src/components/common/Button.tsx`
- VirtualTable: `src/components/common/VirtualTable.tsx`

## Theme

Theme được quản lý thông qua ThemeContext. Sử dụng hook `useTheme` để truy cập theme hiện tại:
