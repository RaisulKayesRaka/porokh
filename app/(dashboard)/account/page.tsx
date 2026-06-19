import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { UpdateNameForm } from "@/components/user/update-name-form";
import { UpdateImageForm } from "@/components/user/update-image-form";
import { ChangeEmailForm } from "@/components/user/change-email-form";
import { ChangePasswordForm } from "@/components/user/change-password-form";
import { DeleteAccountDialog } from "@/components/user/delete-account-dialog";

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader title="Account Settings" />

      <div className="flex flex-col space-y-8 p-6 md:p-8">
        <div className="mx-auto w-full max-w-3xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Profile</h2>
            <p className="text-muted-foreground">
              Manage your personal information and security preferences.
            </p>
          </div>

          <Separator />

          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>
                Update your avatar using an image URL.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateImageForm initialImage={user.image} userName={user.name} />
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Display Name</CardTitle>
              <CardDescription>
                Update your display name. This will be visible to others.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateNameForm initialName={user.name} />
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Change the email address associated with your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangeEmailForm currentEmail={user.email} />
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Change your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Delete your account</h4>
                  <p className="text-muted-foreground text-sm">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <DeleteAccountDialog />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
