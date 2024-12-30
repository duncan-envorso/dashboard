'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Match } from '@/types/schedule';
import { Check, Copy, ExternalLink, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { updateMatchTicketUrl } from '@/app/actions';

interface TicketManagementProps {
  match: Match;
}

export function TicketManagement({ match }: TicketManagementProps) {
  const [ticketsUrl, setTicketsUrl] = useState(match.tickets_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const { toast } = useToast();

  const validateUrl = (url: string) => {
    if (!url.trim()) return null;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setTicketsUrl(value);
    setIsValidUrl(validateUrl(value));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ticketsUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try copying manually',
        variant: 'destructive'
      });
    }
  };

  const handleUpdate = async () => {
    if (!ticketsUrl.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a ticket URL',
        variant: 'destructive'
      });
      return;
    }

    if (!validateUrl(ticketsUrl)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateMatchTicketUrl(match.match_id, ticketsUrl);

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast({
        title: 'Success',
        description: `Ticket URL updated for ${match.name}`,
        variant: 'default'
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Error',
        description: `Failed to update: ${errorMessage}`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const matchDate = new Date(match.start_time);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(matchDate);

  return (
    <TooltipProvider>
      <Card className="mb-4 w-full overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/90 dark:from-slate-900 dark:to-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-white">
                {match.name}
              </CardTitle>
              <div className="text-sm text-white">Round {match.round}</div>
            </div>
          </CardHeader>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={match.homeTeam.image_path}
                    alt={match.homeTeam.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium">vs</span>
                  <Image
                    src={match.awayTeam.image_path}
                    alt={match.awayTeam.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{match.venue}</p>
                  <p className="text-sm text-muted-foreground">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={ticketsUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="Enter tickets URL"
                    type="url"
                    disabled={isLoading}
                    className={cn(
                      'pr-10',
                      isValidUrl === false &&
                        'border-red-500 focus-visible:ring-red-500',
                      isValidUrl === true &&
                        'border-green-500 focus-visible:ring-green-500'
                    )}
                  />
                  {ticketsUrl && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isValidUrl ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      disabled={!ticketsUrl || isLoading}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy URL</TooltipContent>
                </Tooltip>

                {ticketsUrl && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(ticketsUrl, '_blank')}
                        disabled={!isValidUrl || isLoading}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Preview URL</TooltipContent>
                  </Tooltip>
                )}

                <Button
                  onClick={handleUpdate}
                  disabled={isLoading || !isValidUrl}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update URL'
                  )}
                </Button>
              </div>

              {isValidUrl === false && ticketsUrl && (
                <p className="text-sm text-red-500">
                  Please enter a valid URL including http:// or https://
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
