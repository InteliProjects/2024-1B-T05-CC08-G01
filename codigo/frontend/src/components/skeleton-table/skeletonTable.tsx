import { Skeleton } from "../ui/skeleton";

// Definindo o componente SkeletonTable para carregar a tabela
export default function SkeletonTable() {
  return (
    <div className="flex flex-col justify-center gap-5">
      <div className="flex justify-between">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-4 h-4" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-4 h-4" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-4 h-4" />
      </div>
    </div>
  );
}