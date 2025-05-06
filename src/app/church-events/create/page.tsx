'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { churchEventService } from '@/services/api';

export default function CreateChurchEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    isEligibleToCheckIn: false,
    eventImageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

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
      // Create FormData to handle file upload
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'eventImageUrl') {
          submitData.append(key, value.toString());
        }
      });
      if (selectedFile) {
        submitData.append('eventImage', selectedFile);
      }

      const response = await churchEventService.createChurchEvent(submitData);
      if (response.success) {
        toast.success('Church event created successfully');
        router.push('/church-events');
      } else {
        toast.error(response.message || 'Failed to create event');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || 'Failed to create event'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Church Event</h1>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details to add a new church event.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg">
          <div className="p-6 space-y-6">
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
                placeholder="Event title"
              />
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Event description"
                rows={4}
              />
            </div>
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
            {/* Is Eligible To Check In */}
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
                Eligible to Check In
              </label>
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
                {saving ? 'Saving...' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
} 