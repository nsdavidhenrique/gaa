export const isLate = (deadline) => {
    const currentDate = new Date();
    const taskDeadline = new Date(deadline);
    return taskDeadline < currentDate;
}
