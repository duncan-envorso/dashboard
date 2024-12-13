// app/dashboard/team-roster/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RosterMember, StaffMember } from '@/types/team';
import EditTeamMemberForm from '@/components/team-roster/EditTeamMemberForm';

type TeamMember = RosterMember | StaffMember;

export default function EditTeamMemberPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      try {
        // First try to fetch as roster member
        let response = await fetch(`/api/teams/roster/${params.id}`);

        if (!response.ok && response.status === 404) {
          // If not found in roster, try staff
          response = await fetch(`/api/teams/staff/${params.id}`);
        }

        if (!response.ok) {
          throw new Error('Failed to fetch team member');
        }

        const data = await response.json();
        setMember(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [params.id]);

  const handleSuccess = () => {
    // Show success message or toast notification here
    router.push('/dashboard/team-roster'); // Return to roster page
    router.refresh(); // Refresh the page data
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-red-500">{error}</div>
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4">Team member not found</div>
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Determine if the member is staff or roster based on properties
  const isStaff = 'job_title' in member;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:underline"
        >
          ← Back to Roster
        </button>
      </div>

      <EditTeamMemberForm
        type={isStaff ? 'staff' : 'roster'}
        teamId={member.team_id}
        initialData={member}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
