import ContentPageHeader from "../components/content/ContentPageHeader";
import GoogleAnalyticsSettingsCard from "../features/settings/components/GoogleAnalyticsSettingsCard";
import MigrationSettingsCard from "../features/settings/components/MigrationSettingsCard";

export default function Settings() {
  return <div className="space-y-6">
    <ContentPageHeader eyebrow="Portfolio CMS" title="Configurações" description="Centralize as configurações pessoais e integrações do seu portfólio." />
    <GoogleAnalyticsSettingsCard />
    <MigrationSettingsCard />
  </div>;
}
