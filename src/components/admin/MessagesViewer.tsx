import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, MessageSquare, Clock, User, Trash2, Inbox, Lightbulb, Calendar, AtSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface FeedbackMessage {
  id: string;
  message: string;
  type: 'bot' | 'user';
  created_at: string;
}

const MessagesViewer = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsRes, feedbackRes] = await Promise.all([
        supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('feedback_messages')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (contactsRes.error) throw contactsRes.error;
      if (feedbackRes.error) throw feedbackRes.error;

      setContacts(contactsRes.data || []);
      setFeedbackMessages((feedbackRes.data || []) as FeedbackMessage[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.filter(c => c.id !== id));
      toast({
        title: 'Success',
        description: 'Contact submission deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      const { error } = await supabase
        .from('feedback_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFeedbackMessages(feedbackMessages.filter(f => f.id !== id));
      toast({
        title: 'Success',
        description: 'Feedback deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter only user messages from feedback
  const userFeedback = feedbackMessages.filter(msg => msg.type === 'user');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#FF6542] mx-auto" />
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-[#FF6542]/5 to-[#FF6542]/10 border-[#FF6542]/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#0A0908]">Contact Submissions</CardTitle>
            <Mail className="h-5 w-5 text-[#FF6542]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A0908]">{contacts.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {contacts.filter(c => c.status === 'new').length} new submissions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#748386]/5 to-[#748386]/10 border-[#748386]/20 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#0A0908]">User Feedback</CardTitle>
            <Lightbulb className="h-5 w-5 text-[#748386]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0A0908]">{userFeedback.length}</div>
            <p className="text-xs text-gray-600 mt-1">Total suggestions received</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="feedback" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
            <Badge variant="secondary" className="ml-2">{userFeedback.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Contacts</span>
            <Badge variant="secondary" className="ml-2">{contacts.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="mt-6 space-y-4">
          {userFeedback.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#748386]/10 flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8 text-[#748386]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0A0908] mb-2">No feedback yet</h3>
                <p className="text-sm text-gray-600 text-center max-w-sm">
                  User suggestions will appear here once they start providing feedback through the chat widget.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {userFeedback.map((feedback, index) => (
                <Card 
                  key={feedback.id} 
                  className="group bg-white border-gray-200 hover:border-[#748386]/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#748386] to-[#5a6769] flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs bg-[#748386]/10 text-[#748386] border-[#748386]/20">
                                Suggestion
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(feedback.created_at)}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                          </div>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this feedback?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The feedback will be permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Contacts Tab */}
        <TabsContent value="contacts" className="mt-6 space-y-4">
          {contacts.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#FF6542]/10 flex items-center justify-center mb-4">
                  <Inbox className="h-8 w-8 text-[#FF6542]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0A0908] mb-2">No contacts yet</h3>
                <p className="text-sm text-gray-600 text-center max-w-sm">
                  Contact submissions will appear here when visitors reach out through your contact form.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {contacts.map((contact, index) => (
                <Card 
                  key={contact.id} 
                  className="group bg-white border-gray-200 hover:border-[#FF6542]/50 hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Status Bar */}
                  <div className={`h-1 ${contact.status === 'new' ? 'bg-gradient-to-r from-[#FF6542] to-[#912F40]' : 'bg-gray-200'}`} />
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={contact.status === 'new' ? 'default' : 'secondary'}
                            className={contact.status === 'new' ? 'bg-[#FF6542] hover:bg-[#FF6542]/90' : ''}
                          >
                            {contact.status}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(contact.created_at)}
                          </span>
                        </div>
                        <CardTitle className="text-xl font-bold text-[#0A0908] group-hover:text-[#FF6542] transition-colors">
                          {contact.subject}
                        </CardTitle>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete contact submission?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the message from {contact.name}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteContact(contact.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                          <User className="h-5 w-5 text-[#748386]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 mb-0.5">Name</div>
                          <div className="text-sm font-semibold text-[#0A0908] truncate">{contact.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                          <AtSign className="h-5 w-5 text-[#748386]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 mb-0.5">Email</div>
                          <div className="text-sm font-semibold text-[#0A0908] truncate">{contact.email}</div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Message Content */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-[#748386]" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Message</span>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesViewer;
