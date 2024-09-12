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
      icon: <MessageSquare className="h-6 w-6 text-green" />,
      link: "/live-commentary",
    },
    {
      title: "News Articles",
      description: "Latest news and articles about the team",
      icon: <Newspaper className="h-6 w-6 text-green" />,
      link: "/news-articles",
    },
    {
      title: "Notifications",
      description: "Manage and send notifications to users",
      icon: <Bell className="h-6 w-6 text-green" />,
      link: "/notifications",
    },
    {
      title: "Team Roster",
      description: "View and manage the team roster",
      icon: <Users className="h-6 w-6 text-green" />,
      link: "/team-roster",
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-navy">
            Dashboard
          </h2>

        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-light-grey">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {pages.map((page) => (
                <Card key={page.title} className="flex flex-col border-l-4 border-l-green">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      {page.icon}
                      <CardTitle className="text-navy">{page.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{page.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Link href={page.link} passHref>
                      <Button className="w-full bg-navy hover:bg-navy/90 text-white">View</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-t-4 border-t-green">
                <CardHeader>
                  <CardTitle className="text-navy">Live Commentary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Latest comment: &quot;Match is about to begin!&quot;</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-green">
                <CardHeader>
                  <CardTitle className="text-navy">News Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Latest article: &quot;Team's Winning Streak Continues&quot;</p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-green">
                <CardHeader>
                  <CardTitle className="text-navy">Recent Notification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">Title: &ldquo;Back of the Year 2024&rdquo;</p>
                  <p>Body: &ldquo;Reece MacDonald: Major League Rugby Back of the Year 2024&rdquo;</p>
                </CardContent>
              </Card>
            </div> */}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}