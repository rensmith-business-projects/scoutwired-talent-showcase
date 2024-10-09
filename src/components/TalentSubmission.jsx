import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { submitTalent } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';
import Signature from './Signature';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const TalentSubmission = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [signature, setSignature] = useState(null);
  const [drawingFile, setDrawingFile] = useState(null);
  const [drawingPreviewUrl, setDrawingPreviewUrl] = useState(null);
  const [isUnder18DialogOpen, setIsUnder18DialogOpen] = useState(false);
  const [fileSizeError, setFileSizeError] = useState('');
  const isUnder18 = watch("isUnder18");
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

    if (!drawingFile) {
      toast({
        title: "Drawing Required",
        description: "Please upload a drawing before submitting.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('signature', signature);
    formData.append('drawing', drawingFile);

    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred while submitting your talent. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIsUnder18Change = (checked) => {
    if (checked) {
      setIsUnder18DialogOpen(true);
    }
  };

  const handleDrawingUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileSizeError(`File size exceeds 10MB limit. Please choose a smaller file.`);
        setDrawingFile(null);
        setDrawingPreviewUrl(null);
      } else {
        setFileSizeError('');
        setDrawingFile(file);
        const drawingUrl = URL.createObjectURL(file);
        setDrawingPreviewUrl(drawingUrl);
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

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isUnder18" 
            {...register("isUnder18")} 
            onCheckedChange={handleIsUnder18Change}
          />
          <Label htmlFor="isUnder18">I am under 18 years old</Label>
        </div>

        <div>
          <Label htmlFor="drawingDescription">Describe Your Drawing</Label>
          <Textarea id="drawingDescription" {...register("drawingDescription", { required: "Description is required" })} className="h-32" />
          {errors.drawingDescription && <p className="text-red-500 text-sm mt-1">{errors.drawingDescription.message}</p>}
        </div>

        <div>
          <Label htmlFor="drawing">Upload Your Drawing (Max 10MB)</Label>
          <Input id="drawing" type="file" accept="image/*" onChange={handleDrawingUpload} required />
          {fileSizeError && <p className="text-red-500 text-sm mt-1">{fileSizeError}</p>}
          {drawingPreviewUrl && (
            <div className="mt-4">
              <Label>Drawing Preview</Label>
              <img src={drawingPreviewUrl} alt="Drawing preview" className="w-full mt-2 max-h-64 object-contain" />
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
              {isUnder18 && (
                <li>As the parent/guardian of the participant, I give permission for their participation and agree to the terms on their behalf.</li>
              )}
            </ol>
          </div>
        </div>

        <Signature isUnder18={isUnder18} onSignatureChange={setSignature} />

        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Submitting..." : "Submit Your Drawing"}
        </Button>
      </form>

      <Dialog open={isUnder18DialogOpen} onOpenChange={setIsUnder18DialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Important Notice for Under 18 Participants</DialogTitle>
            <DialogDescription>
              As you are under 18, you must obtain a parent or guardian's signature for your submission. Please ensure that a parent or guardian completes the signature field on your behalf.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setIsUnder18DialogOpen(false)}>I Understand</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TalentSubmission;