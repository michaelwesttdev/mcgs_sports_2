import ScrollBox from '@/renderer/components/ScrollBox';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';

export default function HelpPage() {
  return (
    <ScrollBox>
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Help & Documentation</h1>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to MCGS Sports Scorer! This application helps you manage and score various sports events for your school or organization.</p>
          <p className="mt-2">To begin, you can create a new session from the Sessions page. A session represents a specific sports event or competition.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sessions Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The Sessions page allows you to:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Create new sports sessions.</li>
            <li>View and manage existing sessions.</li>
            <li>Navigate into a session to manage its participants, events, and houses.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participant Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Within each session, you can manage participants:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Add new participants manually or import them via CSV.</li>
            <li>Edit participant details (name, gender, date of birth, house).</li>
            <li>Assign participants to houses.</li>
            <li>View a list of all participants in the session.</li>
            <li>View participant-specific statistics and results.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage the events that take place within a session:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Create new events with specific disciplines and scoring metrics.</li>
            <li>Record results for participants in each event.</li>
            <li>View event details and results.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>House Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Organize participants into houses (teams or groups):</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Create and manage houses.</li>
            <li>Assign participants to specific houses.</li>
            <li>View house-specific statistics and results.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Customize the application's behavior and rules:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Configure age groups for different competitions.</li>
            <li>Set up points allocation for individual and team placements.</li>
            <li>Manage VLP (Victor/Victrix Ludorum Points) points.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Printing Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Generate printable reports for sessions and events:</p>
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>Print session summaries.</li>
            <li>Print detailed event results.</li>
            <li>Customize print options like including page breaks or printing only completed events.</li>
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <p className="text-center text-gray-500">For further assistance, please contact support.</p>
    </div>
    </ScrollBox>
  );
}
