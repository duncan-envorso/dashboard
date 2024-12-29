import React from 'react';
import Link from 'next/link';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Bell,
  Users,
  Settings,
  TicketIcon
} from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import AuthRedirectButton from '@/components/AuthRedirectButton';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  console.log(session);

  const pages = [
    {
      title: 'Team Roster',
      description: 'View and manage the team roster',
      icon: <Users className="h-6 w-6 text-primary" />,
      link: '/dashboard/team-roster',
      type: 'internal'
    },
    {
      title: 'Notifications',
      description: 'Manage and send notifications to users',
      icon: <Bell className="h-6 w-6 text-primary" />,
      link: '/dashboard/notifications',
      type: 'internal'
    },
    {
      title: 'News Articles',
      description: 'Latest news and articles about the team',
      icon: <Newspaper className="h-6 w-6 text-primary" />,
      link: '/dashboard/news-articles',
      type: 'internal'
    },
    {
      title: 'Live Commentary',
      description: 'Real-time match updates and commentary',
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      link: '/dashboard/live-commentary',
      type: 'internal'
    },
    {
      title: 'Ticket Management',
      description: 'Update ticket links for individual matches',
      icon: <TicketIcon className="h-6 w-6 text-primary" />,
      link: '/dashboard/ticket-management',
      type: 'internal'
    },
    {
      title: 'Edit Website',
      description: 'Update Seawolves Website',
      icon: <Settings className="h-6 w-6 text-primary" />,
      type: 'external'
    }
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Dashboard
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {pages.map((page) => (
                <Card
                  key={page.title}
                  className="flex flex-col border-l-4 border-l-primary bg-white"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {page.icon}
                      <CardTitle className="text-primary">
                        {page.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{page.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    {page.type === 'internal' ? (
                      <Link href={page.link as string} passHref>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          View
                        </Button>
                      </Link>
                    ) : (
                      <AuthRedirectButton />
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
