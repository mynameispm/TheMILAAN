import React, { useState } from 'react';
import { MapPin, Image as ImageIcon } from 'lucide-react';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Select from '../common/Select';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useProblems } from '../../context/ProblemContext';
import { categoryOptions } from '../../utils/categoryData';
import { useNavigate } from 'react-router-dom';

const ProblemForm: React.FC = () => {
  const { user } = useAuth();
  const { addProblem } = useProblems();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState(user?.location?.address || '');
  const [isUrgent, setIsUrgent] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to post a problem');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const newProblem = await addProblem({
        title,
        description,
        category,
        userId: user.id,
        location: {
          ...user.location,
          address: location,
        },
        isUrgent,
      });
      
      navigate(`/problem/${newProblem.id}`);
    } catch (err) {
      setError('Failed to post problem. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-error-50 border border-error-200 text-error-700 rounded-md">
          {error}
        </div>
      )}
      
      <Input
        id="title"
        label="Problem Title"
        placeholder="Summarize your problem in a clear title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      
      <TextArea
        id="description"
        label="Description"
        placeholder="Provide details about your problem and what kind of help you're looking for"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={6}
      />
      
      <Select
        id="category"
        label="Category"
        options={categoryOptions}
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        placeholder="Select a category"
      />
      
      <Input
        id="location"
        label="Location"
        placeholder="Enter your location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        icon={<MapPin size={18} className="text-gray-500" />}
      />
      
      <div className="flex items-center">
        <input
          id="isUrgent"
          type="checkbox"
          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          checked={isUrgent}
          onChange={(e) => setIsUrgent(e.target.checked)}
        />
        <label htmlFor="isUrgent" className="ml-2 block text-sm text-gray-700">
          Mark as urgent (use only for time-sensitive problems)
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attach Images (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition cursor-pointer">
          <div className="flex justify-center">
            <ImageIcon size={24} className="text-gray-400" />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
        >
          Post Problem
        </Button>
      </div>
    </form>
  );
};

export default ProblemForm;