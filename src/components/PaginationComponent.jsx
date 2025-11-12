import { Box, Button } from "@mui/material";

export default function PaginationComponent({
    currentPage,
    totalPages,
    onPageChange,
    maxVisible = 5,
}) {
    if (totalPages <= 1) return null;

    const pages = [];
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible);
    if (end - start < maxVisible) start = Math.max(0, end - maxVisible);

    for (let i = start; i < end; i++) pages.push(i);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 4 }}>
            <Button
                variant="outlined"
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </Button>

            {start > 0 && (
                <>
                    <Button variant="outlined" onClick={() => onPageChange(0)}>
                        1
                    </Button>
                    {start > 1 && <Button disabled>...</Button>}
                </>
            )}

            {pages.map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? "contained" : "outlined"}
                    onClick={() => onPageChange(page)}
                    sx={{
                        bgcolor: currentPage === page ? "#5CAB7A" : "transparent",
                        "&:hover": { bgcolor: currentPage === page ? "#4a9b6a" : "" },
                    }}
                >
                    {page + 1}
                </Button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <Button disabled>...</Button>}
                    <Button variant="outlined" onClick={() => onPageChange(totalPages - 1)}>
                        {totalPages}
                    </Button>
                </>
            )}

            <Button
                variant="outlined"
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </Button>
        </Box>
    );
}