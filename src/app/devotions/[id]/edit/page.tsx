'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { devotionService } from '@/services/api';
import { Devotion } from '@/types/api';

export default function EditDevotionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    subtitle: '',
    book: '',
    videoUrl: '',
    content: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchDevotion = async () => {
      try {
        const response = await devotionService.getDevotionById(parseInt(params.id));
        if (response.success) {
          if (response.data) {
            const devotion = response.data;
            setFormData({
              date: devotion.date,
              title: devotion.title,
              subtitle: devotion.subtitle,
              book: devotion.book,
              videoUrl: devotion.videoUrl,
              content: devotion.content,
              isActive: devotion.isActive,
            });
          } else {
            console.log('No devotion data returned, but request was successful');
            toast('No devotion found with this ID');
            router.push('/devotions');
          }
        } else {
          toast.error(response.message || 'Failed to fetch devotion');
          router.push('/devotions');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch devotion');
        router.push('/devotions');
      } finally {
        setLoading(false);
      }
    };

    fetchDevotion();
  }, [params.id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('Submitting form data:', formData);
      const response = await devotionService.updateDevotion(parseInt(params.id), formData);
      console.log('Update response:', response);
      
      if (response.success) {
        toast.success('Devotion updated successfully');
        router.push('/devotions');
      } else {
        toast.error(response.message || 'Failed to update devotion');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update devotion'
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Devotion</h1>
            <p className="mt-2 text-sm text-gray-600">
              Update the details of this daily devotion.
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
                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="e.g., Monday, 15-04-2024"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the date in the format: Day, DD-MM-YYYY
                  </p>
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
                    Make this devotion visible to users
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
                Content Details
              </h2>

              <div className="space-y-6">
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
                    placeholder="Enter the devotion title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    A clear and concise title for the devotion
                  </p>
                </div>

                {/* Subtitle */}
                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="Enter an optional subtitle"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Additional context or subtitle (optional)
                  </p>
                </div>

                {/* Bible Reference */}
                <div>
                  <label htmlFor="book" className="block text-sm font-medium text-gray-700">
                    Bible Reference <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="book"
                    name="book"
                    required
                    value={formData.book}
                    onChange={handleChange}
                    placeholder="e.g., John 3:16"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    The Bible passage reference for this devotion
                  </p>
                </div>

                {/* Video URL */}
                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
                    Video URL
                  </label>
                  <input
                    type="url"
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Link to a related video (optional)
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    rows={12}
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write the devotion content here..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    The main content of the devotion. You can use markdown formatting.
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
                onClick={() => router.push('/devotions')}
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