"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/Switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function SettingsPage() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    emailNotifications: true,
    marketingEmails: false,
  })

  const router = useRouter()

  useEffect(() => {
    if (user === undefined) return; // Still loading
    if (!user) {
      router.push("/login")
      return
    }
    setFormData((prev) => ({
      ...prev,
      fullName: user.user_metadata?.full_name || "",
      email: user.email || "",
    }))
    fetchOrCreateUserSettings(user.id)
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchOrCreateUserSettings = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_settings")
      .select("email_notifications, marketing_emails")
      .eq("id", userId)
      .single()
    if (error && error.code === "PGRST116") {
      // Row not found, create it
      const { error: insertError } = await supabase
        .from("user_settings")
        .insert({ id: userId })
      if (!insertError) {
        setFormData((prev) => ({ ...prev, emailNotifications: true, marketingEmails: false }))
      }
    } else if (data) {
      setFormData((prev) => ({
        ...prev,
        emailNotifications: data.email_notifications,
        marketingEmails: data.marketing_emails,
      }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      // Update profile info
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
        },
      })
      if (userError) throw userError

      // Update notification preferences
      const { error: settingsError } = await supabase
        .from("user_settings")
        .update({
          email_notifications: formData.emailNotifications,
          marketing_emails: formData.marketingEmails,
        })
        .eq("id", user?.id)
      if (settingsError) throw settingsError

      setMessage("Settings saved successfully!")
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading || user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          {message && (
            <Alert className="mb-6">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={formData.email} disabled className="bg-gray-50" />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications about your reviews</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={formData.emailNotifications}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, emailNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-gray-500">Receive updates about new features</p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={formData.marketingEmails}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, marketingEmails: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Change Password</Label>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Delete Account</Label>
                    <p className="text-sm text-gray-500">Permanently delete your account and data</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 