# Collaborative Todo

https://todo.guskov.dev/demo.mp4

Try live demo at https://todo.guskov.dev

## Running locally
- You'll need to have docker running on your machine.

- github OAuth credentials need to be obtained and put in `.env.development` file:


```
GITHUB_CLIENT_ID=aabbccddeeff11223344
GITHUB_SECRET=aabbccddeeff112233445566778899
FRONTEND_HOSTNAME=http://localhost:3000
BACKEND_HOSTNAME=http://localhost:8000
YPERSISTENCE=/var/ypersistence
```

- `npm run build && npm run start` will launch local dev server. 

- `npm run deploy` will deploy project to GCP. That would require adding service account key, some values `terraform.tf` would need to be updated.

## Implemented features
- ✅ I as a user can create to-do items, such as a grocery list

- ✅ I as another user can collaborate in real-time with user - so that we
can (for example) edit our family shopping-list together

- ✅ I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on things that are still pending

- ✅ I as a user can see the cursor and/or selection of another-user as he selects/types when he is editing text - so that we can discuss focused words during our online call.

- ✅ I as a user can create multiple to-do lists where each list has its unique URL that I
can share with my friends - so that I could have separate to-do lists for my groceries and work related tasks.

- ✅ I as a user can change the order of tasks via drag & drop

- ✅ I as a user can keep editing the list even when I lose internet connection, and can expect it to sync up with BE as I regain connection

- ✅ I as a user can filter the to-do list and view items that were marked as - (check) so that I can retrospect on my prior progress.
  - 👉 display how many items are hidden

- ✅ I as an owner/creator of a certain to-do list can freeze/unfreeze a to-do list I've created to avoid other users from mutating it
  - 👉 do server side checks
  
- ✅ I as a user can add sub-tasks to my to-do items - so that I could make logical groups of tasks and see their overall progress.

- ✅ I as a user can make infinite nested levels of subtasks.

- ✅ I as a user can move/convert subtasks to tasks via drag & drop

- ✅ I as a user can specify cost/price for a task or a subtask - so that I can track my expenses / project cost.
  - 👉 add global total

- ✅ I as a user can see the sum of the subtasks aggregated in the parent task - so that in my shopping list I can see what contributes to the overall sum. For example I can have a task called “Salad”, where I'd add all ingredients as sub-tasks, and would see how much a salad costs on my shopping list.

- ✅ I as a user can be sure that my todos will be persisted so that important information is not lost when server restarts

### Features still not implemented

- 👉 I as a user can add sub-descriptions of tasks in Markdown and view them as rich text while I'm not editing the descriptions.

- 👉 In addition to regular to-do tasks, I as a user can add “special” typed to-do items, that will have custom style and some required fields:
  - ”work-task”, which has a required field “deadline” - which is a date
  - “food” that has fields:
  - required: “carbohydrate”, “fat”, “protein” (each specified in g/100g)
  - optional: “picture” an URL to an image used to render this item

- 👉 I as a user can use my VR goggles to edit/browse multiple to-do lists in parallel in 3D
space so that I can feel ultra-productive

### Additional stories

- ✅ User can see that app works in offline mode
- ✅ User can authenticate via github
- ✅ User can log out

### Known bugs
- Focus is lost when list item is moved to a parent item (i.e. when Tab or Shift+Tab buttons are pressed)
- Creating a new item steals other users' input focus.

### Further improvements
- Lists reorder via drag-n-drop
- Server-side persistence is not scalable (limited to once instance only)
- Performance could be improved with extensive use or React.memo and useCallbacks
- Some actions (indents) could be only done via keyboard, need mouse/touch UI for that
- UX in general can be more smooth
- Sweet, sweet animations
- Mobile version needs more love
- Tests
- Localization
- Terraform deployment is basic, having proper solution (k8s or docker registry) would be nice
- CI pipeline?
- Soft delete for lists
- Acls for actions on server side, for example anyne can edit a locked list, the checks only present on a client