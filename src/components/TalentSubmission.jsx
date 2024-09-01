import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import SignatureCanvas from 'react-signature-canvas';
import { submitTalent } from '@/lib/api';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TalentSubmission = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [signature, setSignature] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [isUnder18DialogOpen, setIsUnder18DialogOpen] = useState(false);
  const isUnder18 = watch("isUnder18");
  const { toast } = useToast();
  const navigate = useNavigate();
  const signatureRef = useRef();

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
    if (signatureRef.current.isEmpty()) {
      toast({
        title: "Signature Required",
        description: "Please provide your signature before submitting.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('signature', signature);
    formData.append('video', videoFile);
    mutation.mutate(formData);
  };

  const handleIsUnder18Change = (checked) => {
    if (checked) {
      setIsUnder18DialogOpen(true);
    }
  };

  const clearSignature = () => {
    signatureRef.current.clear();
    setSignature(null);
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
          <Checkbox 
            id="isUnder18" 
            {...register("isUnder18")} 
            onCheckedChange={handleIsUnder18Change}
          />
          <Label htmlFor="isUnder18">I am under 18 years old</Label>
        </div>

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

        <div className="mb-6">
          <Label>Legal Agreement</Label>
          <div className="bg-gray-100 p-4 rounded-md text-sm mb-4">
            <p>By signing below, I acknowledge and agree to the following:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-2">
              <li>I grant ScoutWired the right to use my submitted content for promotional purposes.</li>
              <li>I confirm that I have all necessary rights to the content I'm submitting.</li>
              <li>I understand that my personal information will be handled in accordance with ScoutWired's privacy policy.</li>
              <li>I agree to abide by ScoutWired's terms of service and community guidelines.</li>
              {isUnder18 && (
                <li>As the parent/guardian of the participant, I give permission for their participation and agree to the terms on their behalf.</li>
              )}
            </ol>
          </div>
        </div>
        <div>
          <Label>{isUnder18 ? "Parent/Guardian E-Signature" : "E-Signature"}</Label>
          <div className="border border-gray-300 rounded-md p-2">
            <SignatureCanvas 
              ref={signatureRef}
              penColor='black'
              canvasProps={{width: '100%', height: 200, className: 'signature-canvas'}}
              onEnd={() => setSignature(signatureRef.current.toDataURL())}
            />
          </div>
          <div className="mt-2">
            <Button type="button" onClick={clearSignature} variant="outline">Clear Signature</Button>
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending || !videoFile} className="w-full">
          {mutation.isPending ? "Submitting..." : "Submit Your Talent"}
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
