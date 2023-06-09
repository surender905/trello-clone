"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useCallback, useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";

import Column from "./Column";
// import { StrictModeDroppable as Droppable } from "@/dropable/StrictModeDroppable";
import { Column as C } from "@/typing";

const Board = () => {
  const [board, getBoard, setBoardStore] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardStore,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, type } = result;

    console.log(destination, source, type);
    if (!destination) {
      return;
    }
    // handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());

      const [removed] = entries.splice(source.index, 1);

      entries.splice(destination.index, 0, removed);

      const rearrangedColumn = new Map(entries);

      setBoardStore({ ...board, columns: rearrangedColumn });
    }
    // this step is needed as the indexes are stored as number 0, 1,2 etc , insted of id's with dnd libary
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: C = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };
    const finishCol: C = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      ///same column task drag

      newTodos.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardStore({ ...board, columns: newColumns });
    } else {
      //draging to anther column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, { id: finishCol.id, todos: finishTodos });
      setBoardStore({ ...board, columns: newColumns });
    }
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
