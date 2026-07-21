import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/button"; // Wait, make sure Input is from input, not button!
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";
import { Input as CustomInput } from "@/components/ui/input";
import { getFileUrl } from "@/lib/utils";


interface PersonalInfoStepProps {
  initialData: any;
  onNext: () => void;
}

export function PersonalInfoStep({ initialData, onNext }: PersonalInfoStepProps) {
  const [photoUrl, setPhotoUrl] = useState(initialData?.profile_photo_url || "");
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      first_name: initialData?.first_name || "",
      middle_name: initialData?.middle_name || "",
      last_name: initialData?.last_name || "",
      gender: initialData?.gender || "MALE",
      date_of_birth: initialData?.date_of_birth || "",
      marital_status: initialData?.marital_status || "SINGLE",
      blood_group: initialData?.blood_group || "O+",
      nationality: initialData?.nationality || "Indian",
      father_name: initialData?.father_name || "",
      mother_name: initialData?.mother_name || "",
      spouse_name: initialData?.spouse_name || "",
      personal_email: initialData?.personal_email || "",
      phone: initialData?.phone || "",
      preferred_language: initialData?.preferred_language || "English",

      current_address_line1: initialData?.current_address_line1 || "",
      current_address_line2: initialData?.current_address_line2 || "",
      current_city: initialData?.current_city || "",
      current_state: initialData?.current_state || "",
      current_country: initialData?.current_country || "India",
      current_pincode: initialData?.current_pincode || "",

      permanent_address_line1: initialData?.permanent_address_line1 || "",
      permanent_address_line2: initialData?.permanent_address_line2 || "",
      permanent_city: initialData?.permanent_city || "",
      permanent_state: initialData?.permanent_state || "",
      permanent_country: initialData?.permanent_country || "India",
      permanent_pincode: initialData?.permanent_pincode || "",
      is_same_address: initialData?.is_same_address || false,

      emergency_contact_name: initialData?.emergency_contact_name || "",
      emergency_contact_relation: initialData?.emergency_contact_relation || "",
      emergency_contact_phone: initialData?.emergency_contact_phone || "",
    }
  });

  const isSameAddress = watch("is_same_address");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await employeeOnboardingApi.uploadFile(file, "PHOTO");
      if (response.success && response.data?.url) {
        setPhotoUrl(response.data.url);
        toast.success("Profile photo uploaded.");
      } else {
        toast.error("Failed to upload photo.");
      }
    } catch (err: any) {
      toast.error(err.message || "Photo upload error.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      profile_photo_url: photoUrl,
    };

    if (isSameAddress) {
      payload.permanent_address_line1 = data.current_address_line1;
      payload.permanent_address_line2 = data.current_address_line2;
      payload.permanent_city = data.current_city;
      payload.permanent_state = data.current_state;
      payload.permanent_country = data.current_country;
      payload.permanent_pincode = data.current_pincode;
    }

    try {
      const response = await employeeOnboardingApi.saveStep1(payload);
      if (response.success) {
        toast.success("Personal information saved.");
        onNext();
      } else {
        toast.error(response.message || "Failed to save data.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Photo Upload Section */}
      <div className="flex flex-col items-center sm:flex-row gap-6 p-6 rounded-xl border border-border/40 bg-muted/20">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-primary bg-muted">
          {photoUrl ? (
            <img src={getFileUrl(photoUrl)} alt="Employee" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No Photo
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <Label className="font-bold text-foreground">Employee Profile Photo</Label>
          <p className="text-xs text-muted-foreground">
            Please upload a formal front-facing passport size portrait. JPG/PNG only (Max 2MB).
          </p>
          <div className="flex justify-center sm:justify-start gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("profile_photo_input")?.click()}
            >
              Upload Photo
            </Button>
            <input
              id="profile_photo_input"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>
      </div>

      {/* Grid forms */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="font-bold text-foreground">First Name *</Label>
          <CustomInput {...register("first_name", { required: true })} placeholder="First Name" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Middle Name</Label>
          <CustomInput {...register("middle_name")} placeholder="Middle Name" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Last Name *</Label>
          <CustomInput {...register("last_name", { required: true })} placeholder="Last Name" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Gender *</Label>
          <Select defaultValue={watch("gender")} onValueChange={(val) => setValue("gender", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Date of Birth *</Label>
          <CustomInput type="date" {...register("date_of_birth", { required: true })} />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Marital Status *</Label>
          <Select defaultValue={watch("marital_status")} onValueChange={(val) => setValue("marital_status", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SINGLE">Single</SelectItem>
              <SelectItem value="MARRIED">Married</SelectItem>
              <SelectItem value="DIVORCED">Divorced</SelectItem>
              <SelectItem value="WIDOWED">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Blood Group</Label>
          <CustomInput {...register("blood_group")} placeholder="e.g. O+, A-" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Nationality *</Label>
          <CustomInput {...register("nationality", { required: true })} placeholder="Nationality" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Preferred Language *</Label>
          <CustomInput {...register("preferred_language", { required: true })} placeholder="e.g. English, Hindi" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Father's Name *</Label>
          <CustomInput {...register("father_name", { required: true })} placeholder="Father's Full Name" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Mother's Name *</Label>
          <CustomInput {...register("mother_name", { required: true })} placeholder="Mother's Full Name" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Spouse's Name (Optional)</Label>
          <CustomInput {...register("spouse_name")} placeholder="Spouse's Full Name" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Personal Email *</Label>
          <CustomInput type="email" {...register("personal_email", { required: true })} placeholder="email@example.com" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Mobile Number *</Label>
          <CustomInput type="tel" {...register("phone", { required: true })} placeholder="Mobile Phone" />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-md font-bold text-foreground">Emergency Contact Details</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Contact Name *</Label>
            <CustomInput {...register("emergency_contact_name", { required: true })} placeholder="Emergency Contact Name" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Relation *</Label>
            <CustomInput {...register("emergency_contact_relation", { required: true })} placeholder="e.g. Spouse, Father" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Contact Phone *</Label>
            <CustomInput type="tel" {...register("emergency_contact_phone", { required: true })} placeholder="Emergency Contact Phone" />
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-bold text-foreground">Current Address</h3>
          <div className="grid gap-6 md:grid-cols-2 mt-3">
            <div className="space-y-1">
              <Label className="font-bold text-foreground">Address Line 1 *</Label>
              <CustomInput {...register("current_address_line1", { required: true })} placeholder="House/Flat No, Building, Street" />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-foreground">Address Line 2</Label>
              <CustomInput {...register("current_address_line2")} placeholder="Locality, Landmark" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-4 mt-3">
            <div className="space-y-1">
              <Label className="font-bold text-foreground">City *</Label>
              <CustomInput {...register("current_city", { required: true })} placeholder="City" />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-foreground">State *</Label>
              <CustomInput {...register("current_state", { required: true })} placeholder="State" />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-foreground">Country *</Label>
              <CustomInput {...register("current_country", { required: true })} placeholder="Country" />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-foreground">Pincode *</Label>
              <CustomInput {...register("current_pincode", { required: true })} placeholder="Pincode" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="is_same_address"
              checked={isSameAddress}
              onCheckedChange={(checked) => setValue("is_same_address", !!checked)}
            />
            <Label htmlFor="is_same_address" className="text-sm text-muted-foreground cursor-pointer">
              Permanent Address is same as Current Address
            </Label>
          </div>

          {!isSameAddress && (
            <div>
              <h3 className="text-md font-bold text-foreground">Permanent Address</h3>
              <div className="grid gap-6 md:grid-cols-2 mt-3">
                <div className="space-y-1">
                  <Label className="font-bold text-foreground">Address Line 1 *</Label>
                  <CustomInput {...register("permanent_address_line1", { required: true })} placeholder="House/Flat No, Building, Street" />
                </div>
                <div className="space-y-1">
                  <Label className="font-bold text-foreground">Address Line 2</Label>
                  <CustomInput {...register("permanent_address_line2")} placeholder="Locality, Landmark" />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-4 mt-3">
                <div className="space-y-1">
                  <Label className="font-bold text-foreground">City *</Label>
                  <CustomInput {...register("permanent_city", { required: true })} placeholder="City" />
                </div>
                <div className="space-y-1">
                  <Label className="font-bold text-foreground">State *</Label>
                  <CustomInput {...register("permanent_state", { required: true })} placeholder="State" />
                </div>
                <div className="space-y-1">
                  <Label className="font-bold text-foreground">Country *</Label>
                  <CustomInput {...register("permanent_country", { required: true })} placeholder="Country" />
                </div>
                <div className="space-y-1">
                  <Label className="font-bold text-foreground">Pincode *</Label>
                  <CustomInput {...register("permanent_pincode", { required: true })} placeholder="Pincode" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}
