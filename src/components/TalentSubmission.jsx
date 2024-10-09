import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitTalent } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import Signature from './Signature';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const TalentSubmission = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [signature, setSignature] = useState(null);
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [fileSizeError, setFileSizeError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: submitTalent,
    onSuccess: () => {
      navigate('/success');
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data) => {
    if (!signature) {
      toast({
        title: "Signature Required",
        description: "Please provide your signature before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!file) {
      toast({
        title: "File Required",
        description: "Please upload a PDF or image file before submitting.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('signature', signature);
    formData.append('file', file);

    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFileSizeError(`File size exceeds 10MB limit. Please choose a smaller file.`);
        setFile(null);
        setFilePreviewUrl(null);
      } else {
        setFileSizeError('');
        setFile(selectedFile);
        if (selectedFile.type.startsWith('image/')) {
          const fileUrl = URL.createObjectURL(selectedFile);
          setFilePreviewUrl(fileUrl);
        } else {
          setFilePreviewUrl(null);
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Submit Your Drawing</h2>
      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>File Size Limit</AlertTitle>
        <AlertDescription>
          Please note that the maximum allowed file size is 10MB. Larger files will be rejected.
        </AlertDescription>
      </Alert>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="discordUsername">Discord Username</Label>
            <Input id="discordUsername" {...register("discordUsername", { required: "Discord Username is required" })} />
            {errors.discordUsername && <p className="text-red-500 text-sm mt-1">{errors.discordUsername.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="drawingDescription">Describe Your Drawing</Label>
          <Textarea id="drawingDescription" {...register("drawingDescription", { required: "Description is required" })} className="h-32" />
          {errors.drawingDescription && <p className="text-red-500 text-sm mt-1">{errors.drawingDescription.message}</p>}
        </div>

        <div>
          <Label htmlFor="file">Upload Your Drawing (PDF or Image, Max 10MB)</Label>
          <Input id="file" type="file" accept=".pdf,image/*" onChange={handleFileUpload} required />
          {fileSizeError && <p className="text-red-500 text-sm mt-1">{fileSizeError}</p>}
          {filePreviewUrl && (
            <div className="mt-4">
              <Label>File Preview</Label>
              <img src={filePreviewUrl} alt="File preview" className="w-full mt-2 max-h-64 object-contain" />
            </div>
          )}
        </div>

        <div className="mb-6">
          <Label>Legal Agreement</Label>
          <div className="bg-gray-100 p-4 rounded-md text-sm mb-4">
            <p>By signing below, I acknowledge and agree to the following:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-2">
              <li>I grant ScoutWired the right to use my submitted drawing for promotional purposes.</li>
              <li>I confirm that I have all necessary rights to the drawing I'm submitting.</li>
              <li>I understand that my personal information will be handled in accordance with ScoutWired's privacy policy.</li>
              <li>I agree to abide by ScoutWired's terms of service and community guidelines.</li>
            </ol>
          </div>
        </div>

        <Signature onSignatureChange={setSignature} />

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Submitting..." : "Submit Your Drawing"}
        </Button>
      </form>
    </div>
  );
};

export default TalentSubmission;