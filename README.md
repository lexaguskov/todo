## User Stories to Consider/Implement
- DONE: I as a user can create to-do items, such as a grocery list
  - FIXME: clean up the ui

- DONE: I as another user can collaborate in real-time with user - so that we
can (for example) edit our family shopping-list together
  - TODO: conflict resolution
  - TODO: send current cursors to newly connected client

- DONE: I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on
things that are still pending

- DONE: I as a user can see the cursor and/or selection of another-user as he selects/types
when he is editing text - so that we can discuss focused words during our online call.

- DONE: I as a user can create multiple to-do lists where each list has its unique URL that I
can share with my friends - so that I could have separate to-do lists for my groceries
and work related tasks.

- DONE: I as a user can change the order of tasks via drag & drop

- WIP: I as a user can keep editing the list even when I lose internet connection, and can
expect it to sync up with BE as I regain connection
  - TODO: sync

- TODO: I as a user can filter the to-do list and view items that were marked as - DONE: so that I
can retrospect on my prior progress.

- TODO: I as a user can add sub-tasks to my to-do items - so that I could make logical groups
of tasks and see their overall progress.

- TODO: I as a user can specify cost/price for a task or a subtask - so that I can track my
expenses / project cost.

- TODO: I as a user can see the sum of the subtasks aggregated in the parent task - so that in
my shopping list I can see what contributes to the overall sum. For example I can
have a task called “Salad”, where I'd add all ingredients as sub-tasks, and would see
how much a salad costs on my shopping list.

- TODO: I as a user can make infinite nested levels of subtasks.

- TODO: I as a user can add sub-descriptions of tasks in Markdown and view them as rich
text while I'm not editing the descriptions.

- TODO: In addition to regular to-do tasks, I as a user can add “special” typed to-do items, that
will have custom style and some required fields:
  - ”work-task”, which has a required field “deadline” - which is a date
  - “food” that has fields:
  - required: “carbohydrate”, “fat”, “protein” (each specified in g/100g)
  - optional: “picture” an URL to an image used to render this item

- TODO: I as a user can use my VR goggles to edit/browse multiple to-do lists in parallel in 3D
space so that I can feel ultra-productive

- TODO: I as a user can move/convert subtasks to tasks via drag & drop

- TODO: I as a user can be sure that my todos will be persisted so that important information
is not lost when server restarts

- TODO: I as an owner/creator of a certain to-do list can freeze/unfreeze a to-do list I've
created to avoid other users from mutating it
