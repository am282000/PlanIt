# PlanIt Documentation

1. **UI/UX Preview**

   - Place your screenshots or videos showing the user interface and overall design.

2. **Features in Action**
  ![](public/docs/pic1.png)

3. **Project Walkthrough**
   ![](public/docs/MixtureOpen.gif)

4. **Kanban Board Demo**
   - Show the drag-and-drop functionality and the management of issues in the Kanban board.

## Features

- **Protected & Public Routes**: Middleware ensures only authorized users can access certain routes.
- **Dynamic Routing**:
  - `[[...sign-in]]`: Catch-all route for URLs following `/sign-in`.
  - `(auth)`: Ignores the folder as a route.
  - `[orgId]`: Dynamic routes for organizations (e.g., `/organization/ashish`).
- **Custom Pages**:
  - 404 Not Found Page.
  - React Spinners for loading states.

---

## Tech Stack

- **Database**: PostgreSQL with Neon hosting.
- **ORM**: Prisma for managing schemas, queries, and data.
  - `npx prisma init` for initialization.
  - `npx prisma generate` & `npx prisma migrate dev` for model creation and migrations.
- **Backend**: Server Actions in Next.js for secure backend logic.

---

## Database Design

- **User Table**: Clerk handles user management with a custom `clerkUserId` field.
- **Organizations & Projects**:
  - Users can create multiple organizations with unique keys (e.g., ECAL).
  - Projects are linked to organizations (`organizationId` foreign key).
  - Projects have associated sprints (`projectId` as a foreign key).
  - Issues can be linked to projects, sprints, and users via multiple foreign keys.
- **Data Constraints**:
  - One unique key per organization.
  - Cascade delete functionality ensures that deleting a project removes related sprints and issues.

- **ER Diagram** 
[View on Eraser![](https://app.eraser.io/workspace/xrstnVdrGQO6WDR9CsNM/preview?elements=WlC9kzqIKbwlZh-MhMP9PA&type=embed)](https://app.eraser.io/workspace/xrstnVdrGQO6WDR9CsNM?elements=WlC9kzqIKbwlZh-MhMP9PA)
---

## Features for Users

### 1. **Organizations**

- Create and manage organizations with up to 5 members.
- Admins can assign roles (Admin, Member), invite users, and manage permissions.
- Redirect unauthorized users to onboarding if no organization exists.

### 2. **Projects**

- Admins create projects, validate using React Hook Form and Zod.
- Projects can be updated or deleted (with confirmation).
- Custom hooks manage loading states, errors, and toast notifications.

### 3. **Sprints**

- Sprints automatically named, default duration is 14 days.
- Admins can start, end, or switch between sprints.
- Sprint statuses: Planned, Active, Ended.

### 4. **Kanban Board**

- Drag-and-drop support with `@hello-pangea/dnd`.
- Cards can be rearranged within a column or moved between columns:
  - Update issue status and order during these actions.
  - Handle edge cases for Planned or Completed sprints.

---

## Key Functionalities

- **Issue Management**:
  - Create issues with a beautiful drawer interface using React-md-editor (Markdown support).
  - Default priority set to "Medium"; sorted by priority and order on the board.
- **Dynamic Data Handling**:
  - `getProjects`: Fetch projects associated with an organization.
  - `deleteProject`: Admin-only action with confirmation.
  - Fetch sprint statuses and issue lengths dynamically.
  - `getOrganizationUsers`: Fetch members for issue assignment.

---

## Optimizations

- **Prisma Client**: Addressed Vite’s hot-reloading issue by using `globalThis.prisma` to avoid creating multiple Prisma clients in development mode.
- **React Hook Form & Zod**: Integrated form validation to avoid unnecessary errors.
- **Suspense Fallback**: Display a bar loader while waiting for data (e.g., project by ID).

---

## Challenging Work

- **Drag-and-Drop**: Implementing real-time updates for the Kanban board.
- **Complex Sprint & Issue Workflows**: Managing transitions (e.g., from Planned to Active) while maintaining integrity.
- **Cascading Deletes**: Ensuring data integrity when deleting projects or sprints.

---

## Example Code (Drag-and-Drop)

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

---

## Routing

- **Protected & Public Routes**: Implemented using middleware to protect routes based on authentication.
- **Catch-All Routes**: Use `[[...sign-in]]` for routes that follow `/sign-in`.
- **Ignore Folder as Route**: Use `(auth)` to prevent a folder from being treated as a route.

---

## Database & Prisma ORM

- **Organizations**: Managed through Clerk for user authentication and organization creation.
- **Database**: PostgreSQL hosted on Neon.
- **Prisma ORM**: Used for database communication, including schema management and querying.
  - Connection string stored in `.env`.
  - User tables initialized with `clerkUserId`.
  - Cascade delete for projects, sprints, and issues.

---

## Dynamic Routes

- **Example**: `/organization/ashish` where `[orgId]` is dynamic.
- **Routing Syntax**:
  - `ignoreRoute`: Ignores a folder from being treated as a route.
  - `[[...catchAll]]`: Catches all routes following a certain path.

---

## User Management

- **Organization Management**: Admins can create organizations, assign roles, and invite members.
- **Protected Routes**: Redirect to onboarding if no organization exists.
- **Role Management**: Only admins can manage projects and members.

---

## Forms & Validation

- **React Hook Form & Zod**: Used to handle forms with validation and error management.
- **Custom Hooks**: Manage loading, error states, and data storage.

---

## Project & Sprint Management

- **Create & Manage Projects**: Only admins can create projects. Projects can be updated and deleted.
- **Sprints**: Default to 14-day duration, with admins controlling start, end, and status changes.

---

## Issue Management & Kanban Board

- **Kanban Board**: Issues are managed with drag-and-drop functionality.
- **Issue Movement**: Cards can be rearranged within the column or moved between columns, updating their status and order.
- **Priority Sorting**: Issues sorted by priority on the board.

---

## Transactions

- **Issue Updates**: Using transactions to ensure API operations are atomic.
- **Issue Deletion**: Reporters or admins can delete issues; others cannot change priority.

---

## UI/UX

- **Issue Details**: Click on a card to view and manage issue details.
- **Dynamic Routing**: Redirect to a project page if necessary.
- **Issue Filtering**: Filter issues by title, assignee, or priority.

---

## Deployment

- **Deployment**: Deployed using Vercel with Prisma integration.
- **Environment Variables**: Set required keys in `.env` for deployment.
