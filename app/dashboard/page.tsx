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
import { LayoutDashboard, MessageSquare, Newspaper, Bell, Users, UserCog } from 'lucide-react';

export default function Dashboard() {
  const pages = [
    {
      title: "Live Commentary",
      description: "Real-time match updates and commentary",
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      link: "/dashboard/live-commentary",
    },
    {
      title: "News Articles",
      description: "Latest news and articles about the team",
      icon: <Newspaper className="h-6 w-6 text-primary" />,
      link: "/dashboard/news-articles",
    },
    {
      title: "Notifications",
      description: "Manage and send notifications to users",
      icon: <Bell className="h-6 w-6 text-primary" />,
      link: "/dashboard/notifications",
    },
    {
      title: "Team Roster",
      description: "View and manage the team roster",
      icon: <Users className="h-6 w-6 text-primary" />,
      link: "/team-roster",
    },
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
                <Card key={page.title} className="flex flex-col border-l-4 border-l-primary bg-white">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {page.icon}
                      <CardTitle className="text-primary">{page.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{page.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Link href={page.link} passHref>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        View
                      </Button>
                    </Link>
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