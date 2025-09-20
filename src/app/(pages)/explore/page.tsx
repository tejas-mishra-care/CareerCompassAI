import { AppShell } from '@/components/layout/app-shell';
import { CareerChatbot } from '@/components/explore/career-chatbot';

export default function ExplorePage() {
  return (
    <AppShell>
      <div className="h-[calc(100vh-theme(spacing.14))] flex flex-col">
        <CareerChatbot />
      </div>
    </AppShell>
  );
}
