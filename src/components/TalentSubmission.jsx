import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SignatureCanvas from 'react-signature-canvas';

const TalentSubmission = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [signature, setSignature] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const onSubmit = (data) => {
    console.log(data, signature, videoFile);
    // Here you would typically send this data to your backend
    alert('Submission received! Thank you for participating.');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Submit Your Talent</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...register("name", { required: "Name is required" })} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="talentDescription">Describe Your Talent</Label>
          <Textarea id="talentDescription" {...register("talentDescription", { required: "Description is required" })} />
          {errors.talentDescription && <p className="text-red-500">{errors.talentDescription.message}</p>}
        </div>

        <div>
          <Label htmlFor="video">Upload Your Video</Label>
          <Input id="video" type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} required />
        </div>

        <div>
          <Label>E-Signature</Label>
          <SignatureCanvas 
            penColor='black'
            canvasProps={{width: 500, height: 200, className: 'border border-gray-300'}}
            onEnd={() => setSignature(true)}
          />
        </div>

        <Button type="submit" disabled={!signature || !videoFile}>Submit Your Talent</Button>
      </form>
    </div>
  );
};

export default TalentSubmission;