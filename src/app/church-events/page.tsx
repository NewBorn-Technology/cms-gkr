'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { churchEventService } from '@/services/api';
import { ChurchEvent } from '@/types/api';
import { Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

type SortField = 'title' | 'eventDate' | 'isActive' | 'isEligibleToCheckIn';
type SortDirection = 'asc' | 'desc';

export default function ChurchEventsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [sortField, setSortField] = useState<SortField>('eventDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await churchEventService.getChurchEvents();
        if (response.success && Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          toast.error('Unexpected response from server.');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch church events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await churchEventService.deleteChurchEvent(id);
        if (response.success) {
          toast.success('Event deleted successfully');
          setEvents(events.filter(event => event.id !== id));
        } else {
          toast.error(response.message || 'Failed to delete event');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'title':
        return multiplier * a.title.localeCompare(b.title);
      case 'eventDate':
        return multiplier * (new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
      case 'isActive':
        return multiplier * (a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1);
      case 'isEligibleToCheckIn':
        return multiplier * (a.isEligibleToCheckIn === b.isEligibleToCheckIn ? 0 : a.isEligibleToCheckIn ? 1 : -1);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Church Events</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all church events including their title, date, time, and status.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => router.push('/church-events/new')}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
            >
              Add Event
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="w-16 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Image
                      </th>
                      <th scope="col" className="w-1/4 py-3.5 pl-3 pr-3 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th scope="col" className="w-1/6 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th scope="col" className="w-1/6 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Time
                      </th>
                      <th scope="col" className="w-1/6 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                          <div className="h-16 w-16 flex-shrink-0">
                            {event.eventImageUrl ? (
                              <img
                                src={event.eventImageUrl}
                                alt={event.title}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-500">No Image</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-3 text-sm font-medium text-gray-900">
                          {event.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(event.eventDate)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {event.eventTime}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            event.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {event.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-4">
                            <button
                              onClick={() => router.push(`/church-events/${event.id}/edit`)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 