import React from 'react';

interface SkeletonProps {
    skel_width?: string;
    skel_height?: string;
    skel_borderRadius?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
    skel_width = "40px",
    skel_height = "24px",
    skel_borderRadius = "8px"
}) => {
    return (
        <div
            style={{
                width: skel_width,
                height: skel_height,
                borderRadius: skel_borderRadius
            }}
        >

        </div>
    )
}

export default Skeleton