'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Img } from 'react-image';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { churchEventService } from '@/services/api';
import { ChurchEvent } from '@/types/api';
import { Pencil, Trash2, ChevronUp, ChevronDown, X, Plus, Image as ImageIcon } from 'lucide-react';

type SortField = 'title' | 'eventDate' | 'isActive' | 'isEligibleToCheckIn';

export default function ChurchEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('eventDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await churchEventService.getChurchEvents();
      if (response.success) {
        console.log('Received events data:', response.data);
        
        // Handle null data gracefully by setting an empty array
        setEvents(response.data || []);
        
        // Log but don't show an error to the user
        if (response.data === null) {
          console.log('API returned success with null data');
        }
      } else {
        // Only show error toast when the API explicitly returns success: false
        console.error('API returned error:', response.message);
        toast.error(response.message || 'Failed to fetch events');
      }
    } catch (error: any) {
      // Only show error for actual exceptions (network issues, etc.)
      console.error('Exception when fetching events:', error);
      const errorMessage = error.response?.data?.message || 'Network error while fetching events';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await churchEventService.deleteChurchEvent(id);
        if (response.success) {
          toast.success('Event deleted successfully');
          setEvents(events.filter(event => event.id !== id));
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[date.getDay()];
    const dayOfMonth = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}, ${dayOfMonth}-${month}-${year}`;
  };

  // Function to handle image errors
  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Church Events</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and organize all your church events in one place.
            </p>
          </div>
          <button
            onClick={() => router.push('/church-events/create')}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-16 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      <SortIcon field="title" />
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('eventDate')}
                  >
                    <div className="flex items-center">
                      Date
                      <SortIcon field="eventDate" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('isActive')}
                  >
                    <div className="flex items-center">
                      Status
                      <SortIcon field="isActive" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.eventImageUrl ? (
                        <div className="h-10 w-10 relative">
                          <Img
                            src={event.eventImageUrl}
                            alt={event.title}
                            className="h-10 w-10 rounded-lg object-cover cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={() => setPreviewImage({ 
                              url: event.eventImageUrl!, 
                              title: event.title 
                            })}
                            loader={<div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse"></div>}
                            unloader={
                              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            }
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(event.eventDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{event.eventTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {event.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/church-events/${event.id}/edit`)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closePreview}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <div className="flex justify-between items-center mb-4 px-4 pt-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {previewImage.title}
                    </h3>
                    <button
                      type="button"
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={closePreview}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-2 px-4 pb-4 relative">
                    <div className="relative w-full h-[400px]">
                      <Img
                        src={previewImage.url}
                        alt={previewImage.title}
                        className="w-full h-full object-contain rounded-lg"
                        loader={<div className="w-full h-full rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">Loading...</div>}
                        unloader={
                          <div className="w-full h-[400px] rounded-lg bg-gray-100 flex flex-col items-center justify-center">
                            <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-500">Failed to load image</p>
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 