import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from "antd"
import { UserOutlined, SafetyCertificateOutlined, KeyOutlined, SettingOutlined } from '@ant-design/icons'

export default function DashboardPage() {
  const username = "Người dùng" // TODO: Fetch actual user data

  const menuItems = [
    { title: "Quản lý người dùng", icon: UserOutlined, link: "/users" },
    { title: "Quản lý vai trò", icon: SafetyCertificateOutlined, link: "/roles" },
    { title: "Quản lý quyền truy cập", icon: KeyOutlined, link: "/permissions" },
    { title: "Cài đặt hệ thống", icon: SettingOutlined, link: "/settings" },
  ]

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <Card.Meta
          title={<h2 className="text-3xl font-bold">Xin chào, {username}</h2>}
          description="Chào mừng bạn đến với bảng điều khiển quản lý truy cập và bảo mật dữ liệu"
        />
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {menuItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <Card.Meta
              title={item.title}
              avatar={<item.icon className="text-2xl" />}
            />
            <Link to={item.link}>
              <Button className="w-full mt-4">Truy cập</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
