import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const COLORS = [
  '#6366f1',
  '#14b8a6',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4'
];

const ProjectTimeChart = ({ summary }) => {
  const projects = summary?.projects || [];
  const totalMinutes = summary?.totalMinutes || 0;

  if (!totalMinutes || projects.length === 0) {
    return <p>No tracked time available yet.</p>;
  }

  return (
    <div className="w-full mx-4">
      <div className="relative h-45 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={projects}
              dataKey="totalMinutes"
              nameKey="projectName"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              stroke="none"
            >
              {projects.map((project, index) => (
                <Cell
                  key={project.projectName}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                `${Math.floor(value / 60)}h ${value % 60}m`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Total time in the center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* <span className="text-sm text-gray-500">Total Time</span> */}
          <span className="text-2xl font-bold">
            {summary.totalTime}
          </span>
        </div>
      </div>

      {/* Project breakdown */}
      {/* <div className="mt-4 space-y-3">
        {projects.map((project, index) => {
          const percentage = (
            (project.totalMinutes / totalMinutes) * 100
          ).toFixed(1);

          return (
            <div
              key={project.projectName}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />

                <span className="truncate text-sm">
                  {project.projectName}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm shrink-0">
                <span>{project.totalTime}</span>
                <span className="text-gray-500">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default ProjectTimeChart;