### PlanIt Documentation

**Features:**
- **Protected & Public Routes**: Implemented using middleware; unauthorized users are redirected to sign-in.
- **Dynamic Routing**:
  - `[[...sign-in]]`: Catch-all route for URLs following `/sign-in`.
  - `(auth)`: Ignored as a route folder.
  - `[orgId]`: Dynamic organization routes, e.g., `/organization/ashish`.
- **Custom Pages**:
  - 404 Not Found Page.
  - React Spinners for loading states.

---

**Tech Stack:**
- **Database**: PostgreSQL with Neon hosting.
- **ORM**: Prisma for managing schemas, queries, and data.
  - `npx prisma init` to initialize.
  - `npx prisma generate` & `npx prisma migrate dev` for model creation and migrations.
- **Backend**: Server Actions in Next.js for secure backend logic.

---

**Database Design:**
- **User Table**: Clerk provides user management; custom table includes `clerkUserId`.
- **Organizations & Projects**:
  - Separate organizations per user, each with unique keys (e.g., ECAL).
  - Projects belong to organizations (`organizationId` foreign key).
  - Projects have sprints (`projectId` as a foreign key).
  - Issues linked to projects, sprints, and users via multiple foreign keys.
- **Data Constraints**:
  - One unique key per organization.
  - Cascade delete for projects, sprints, and related data.

---

**Features for Users:**
1. **Organizations**:
   - Create organizations with up to 5 members.
   - Manage roles (Admin, Member).
   - Admins can update, delete, and invite members.
2. **Projects**:
   - Admins create projects with validation via React Hook Form and Zod.
   - Projects can be updated or deleted (confirmations included).
   - Custom hooks handle loading, error states, and toasts.
3. **Sprints**:
   - Automatically named, 14-day duration by default.
   - Sprint management: start, end, and switch between sprints.
   - Status management (e.g., Planned, Active, Ended).
4. **Kanban Board**:
   - Drag-and-drop using `@hello-pangea/dnd`.
   - Rearrange cards within a column or move between columns:
     - Update status and order.
     - Handle edge cases for Planned or Completed sprints.
   - Issues include title, status, priority, and assignee.

---

**Key Functionalities:**
- **Issue Management**:
  - Create issues with a drawer interface (Markdown editor included).
  - Default priority is "Medium"; sorted by priority and order on the board.
- **Dynamic Data Handling**:
  - `getProjects`: Fetch all projects in an organization.
  - `deleteProject`: Admin-only action with confirmation popups.
  - Fetch sprint statuses and lengths dynamically.
  - `getOrganizationUsers`: Fetch organization members for issue assignment.

---

**Optimizations:**
- **Prisma Client**: Resolved Vite’s hot-reloading issue by using `globalThis.prisma` to reuse Prisma clients in development mode.
- **React Hook Form + Zod**: Integrated validation for cleaner forms and reduced errors.
- **Suspense Fallback**: Bar loader while data (e.g., project by ID) is loading.

---

**Challenging Work:**
- Implementing drag-and-drop in Kanban for real-time board updates.
- Handling complex sprint and issue workflows, ensuring smooth state transitions (e.g., Planned → Active → Ended).
- Streamlined cascading deletes for maintaining data integrity.

---

**Example Code (Drag-and-Drop):**
```javascript
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const onDragEnd = (result) => {
  console.log("Dragged:", result);
};

const BasicDragDrop = () => {
  const items = [
    { id: "1", content: "Item 1" },
    { id: "2", content: "Item 2" },
    { id: "3", content: "Item 3" },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BasicDragDrop;
```
