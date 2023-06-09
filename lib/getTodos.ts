import { database } from "@/appwite";
import { Board, Column, TypedColumn } from "@/typing";

export const gettodosGroupedByColumn = async () => {
  const data = await database.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );

  const todos = data.documents;
  const coloums = todos.reduce((acc, todo) => {
    if (!acc.get(todo.status)) {
      acc.set(todo.status, {
        id: todo.status,
        todos: [],
      });
    }
    acc.get(todo.status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });

    return acc;
  }, new Map<TypedColumn, Column>());

  //   console.log(coloums);

  // if column doesn't have todos in any of column show empty column

  const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];

  for (const c of columnTypes) {
    if (!coloums.get(c)) {
      coloums.set(c, {
        id: c,
        todos: [],
      });
    }
  }

  const sortedColumns = new Map(
    Array.from(coloums.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortedColumns,
  };

  return board;
};
