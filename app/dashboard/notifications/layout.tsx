import { NotificationsProvider } from '@/app/contexts/NotifcationsContext'
import React from 'react'

function NotificationsLayout({ children }: { children: React.ReactNode }) {
    return (
        <NotificationsProvider>
            <div>{children}</div>
        </NotificationsProvider>
    )
}

export default NotificationsLayout