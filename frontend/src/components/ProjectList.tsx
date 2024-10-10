// src/components/ProjectList.tsx

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/models';

interface ProjectListProps {
    projects: Project[];
}

const ProjectList: FC<ProjectListProps> = ({ projects }) => {
    const navigate = useNavigate();

    if (projects.length === 0) {
        return <p className="mt-4">You have no projects yet.</p>;
    }

    return (
        <div className="mt-4 space-y-4">
            {projects.map((project) => (
                <Card
                    key={project.id}
                    className="p-4 cursor-pointer hover:bg-gray-100"
                    onClick={() => navigate(`/projects/${project.id}`)}
                >
                    <h3 className="text-lg font-semibold">
                        {project.projectName}
                    </h3>
                </Card>
            ))}
        </div>
    );
};

export default ProjectList;
