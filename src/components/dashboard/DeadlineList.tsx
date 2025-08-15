import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';
import { Book } from '@/types';
import { cn } from '@/lib/utils';

interface DeadlineListProps {
  books: Book[];
}

export function DeadlineList({ books }: DeadlineListProps) {
  const sortedBooks = books
    .filter(book => book.status !== 'Done')
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-error bg-error/10 border-error/20';
    if (daysLeft <= 3) return 'text-warning bg-warning/10 border-warning/20';
    if (daysLeft <= 7) return 'text-accent bg-accent/10 border-accent/20';
    return 'text-muted-foreground bg-muted/50 border-muted/20';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Deadline Terdekat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedBooks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Tidak ada deadline mendekat</p>
          ) : (
            sortedBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1 mb-1">{book.title}</h4>
                  <p className="text-xs text-muted-foreground">{book.pic}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={cn("text-xs", getUrgencyColor(book.daysLeft))}>
                    {book.daysLeft < 0 ? (
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Terlambat
                      </span>
                    ) : book.daysLeft === 0 ? (
                      'Hari ini'
                    ) : (
                      `${book.daysLeft} hari`
                    )}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(book.deadline).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}