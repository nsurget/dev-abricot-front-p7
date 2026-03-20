export default async function ProjectSinglePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Project Single ID: {id}</h1>
    </div>
  );
}
