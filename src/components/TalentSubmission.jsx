import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SignatureCanvas from 'react-signature-canvas';
import { submitTalent } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";

const TalentSubmission = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [signature, setSignature] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const isUnder18 = watch("isUnder18");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: submitTalent,
    onSuccess: () => {
      toast({
        title: "Submission Successful",
        description: "Thank you for participating!",
      });
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
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('signature', signature);
    formData.append('video', videoFile);
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Submit Your Talent</h2>
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
          <Checkbox id="isUnder18" {...register("isUnder18")} />
          <Label htmlFor="isUnder18">I am under 18 years old</Label>
        </div>

        {isUnder18 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Important Notice</p>
            <p>As you are under 18, you must obtain a parent or guardian's signature for your submission.</p>
          </div>
        )}

        <div>
          <Label htmlFor="talentDescription">Describe Your Talent</Label>
          <Textarea id="talentDescription" {...register("talentDescription", { required: "Description is required" })} className="h-32" />
          {errors.talentDescription && <p className="text-red-500 text-sm mt-1">{errors.talentDescription.message}</p>}
        </div>

        <div>
          <Label htmlFor="video">Upload Your Video</Label>
          <Input id="video" type="file" accept="video/*" onChange={(e) => {
            const file = e.target.files[0];
            setVideoFile(file);
            if (file) {
              const videoUrl = URL.createObjectURL(file);
              setVideoPreviewUrl(videoUrl);
            }
          }} required />
          {videoPreviewUrl && (
            <div className="mt-4">
              <Label>Video Preview</Label>
              <video src={videoPreviewUrl} controls className="w-full mt-2 max-h-64 object-contain" />
            </div>
          )}
        </div>

        <div>
          <Label>{isUnder18 ? "Parent/Guardian E-Signature" : "E-Signature"}</Label>
          <SignatureCanvas 
            penColor='black'
            canvasProps={{width: '100%', height: 200, className: 'border border-gray-300 rounded-md w-full'}}
            onEnd={() => setSignature(true)}
          />
        </div>

        <Button type="submit" disabled={mutation.isPending || !signature || !videoFile} className="w-full">
          {mutation.isPending ? "Submitting..." : "Submit Your Talent"}
        </Button>
      </form>
    </div>
  );
};

export default TalentSubmission;