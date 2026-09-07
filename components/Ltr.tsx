/**
 * Isolates left-to-right content (phone numbers, emails, URLs, dates) inside an
 * RTL paragraph. Without this the bidi algorithm reorders the digit groups of a
 * phone number, so "+93 799 65 94 50" renders as "50 94 65 799 93+".
 */
export default function Ltr({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={className}>
      {children}
    </bdi>
  );
}
