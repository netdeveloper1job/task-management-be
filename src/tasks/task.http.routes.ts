export const TaskParentRoute = 'task';

export const TaskRoutes = {
    create: '',
    update: 'update/:id',
    delete: ':id',
    view_one: '/taskById/:id',
    view_all: '/:search',
    getTasksByUserId: '/getTasksByUserId/:id/:search',
}