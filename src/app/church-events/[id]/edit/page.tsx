'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { churchEventService } from '@/services/api';
import { ChurchEvent } from '@/types/api';
import { Pencil } from 'lucide-react';

export default function EditChurchEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    isEligibleToCheckIn: false,
    eventImageUrl: '',
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await churchEventService.getChurchEventById(parseInt(params.id));
        if (response.success) {
          const event = response.data;
          setFormData({
            title: event.title,
            description: event.description,
            eventDate: event.eventDate,
            eventTime: event.eventTime,
            isEligibleToCheckIn: event.isEligibleToCheckIn,
            eventImageUrl: event.eventImageUrl,
            isActive: event.isActive,
          });
          if (event.eventImageUrl) {
            // If the URL is already absolute, use it as is; otherwise, prepend the API base URL
            const isAbsolute = event.eventImageUrl.startsWith('http');
            const imageUrl = isAbsolute
              ? event.eventImageUrl
              : `https://api-shepherd.jar-vis.com/${event.eventImageUrl.replace(/^\//, '')}`;
            setPreviewUrl(imageUrl);
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch event');
        router.push('/church-events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id, router]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'eventImageUrl') {
          submitData.append(key, value.toString());
        }
      });
      if (selectedFile) {
        submitData.append('eventImage', selectedFile);
      } else if (formData.eventImageUrl) {
        submitData.append('eventImageUrl', formData.eventImageUrl);
      }

      console.log('Submitting form data:', Object.fromEntries(submitData));
      const response = await churchEventService.updateChurchEvent(parseInt(params.id), submitData);
      if (response.success) {
        toast.success('Event updated successfully');
        router.push('/church-events');
      } else {
        toast.error(response.message || 'Failed to update event');
      }
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update event'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              {isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-primary focus:outline-none focus:border-secondary"
                />
              ) : (
                <h1 
                  className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-primary flex items-center group"
                  onClick={handleTitleClick}
                >
                  {formData.title}
                  <Pencil className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h1>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Update the details of this church event
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg">
          <div className="p-6 space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                {/* Is Active */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                  <p className="ml-6 text-sm text-gray-500">
                    Make this event visible to users
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            {/* Event Details Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
                Event Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Date */}
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                    Event Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    required
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>

                {/* Event Time */}
                <div>
                  <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">
                    Event Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    name="eventTime"
                    required
                    value={formData.eventTime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              {/* Check-in Eligibility */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEligibleToCheckIn"
                  name="isEligibleToCheckIn"
                  checked={formData.isEligibleToCheckIn}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isEligibleToCheckIn" className="ml-2 block text-sm text-gray-900">
                  Enable Check-in
                </label>
                <p className="ml-6 text-sm text-gray-500">
                  Allow users to check in for this event
                </p>
              </div>

              {/* Event Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Image
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input
                      type="file"
                      id="eventImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-secondary"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/church-events')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
} 