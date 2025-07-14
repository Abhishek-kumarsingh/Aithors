"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  MoreVert,
  Download,
  Refresh,
  Fullscreen,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

export interface ChartData {
  [key: string]: any;
}

export interface ModernChartCardProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
  chartType: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radar';
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  colors?: string[];
  height?: number;
  loading?: boolean;
  error?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label: string;
  };
  onRefresh?: () => void;
  onExport?: (format: 'png' | 'svg' | 'pdf' | 'csv') => void;
  showLegend?: boolean;
  showGrid?: boolean;
  animated?: boolean;
  variant?: 'default' | 'glassmorphism' | 'minimal';
}

const defaultColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export const ModernChartCard: React.FC<ModernChartCardProps> = ({
  title,
  subtitle,
  data,
  chartType,
  dataKey,
  xAxisKey = 'name',
  color = '#3b82f6',
  colors = defaultColors,
  height = 300,
  loading = false,
  error,
  trend,
  onRefresh,
  onExport,
  showLegend = true,
  showGrid = true,
  animated = true,
  variant = 'default',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: 'png' | 'svg' | 'pdf' | 'csv') => {
    onExport?.(format);
    handleMenuClose();
  };

  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert 
            severity="error" 
            action={
              onRefresh && (
                <Button color="inherit" size="small" onClick={onRefresh}>
                  Retry
                </Button>
              )
            }
          >
            {error}
          </Alert>
        </Box>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <Typography variant="body2" color="text.secondary">
            No data available
          </Typography>
        </Box>
      );
    }

    const commonProps = {
      width: '100%',
      height,
      data,
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />}
              <XAxis dataKey={xAxisKey} stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                animationDuration={animated ? 1000 : 0}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />}
              <XAxis dataKey={xAxisKey} stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              {showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fill={`${color}20`}
                strokeWidth={2}
                animationDuration={animated ? 1000 : 0}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart>
              {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />}
              <XAxis dataKey={xAxisKey} stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              {showLegend && <Legend />}
              <Bar
                dataKey={dataKey}
                fill={color}
                radius={[4, 4, 0, 0]}
                animationDuration={animated ? 1000 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
      case 'donut':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={chartType === 'donut' ? 60 : 0}
                outerRadius={100}
                paddingAngle={2}
                dataKey={dataKey}
                animationDuration={animated ? 1000 : 0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer {...commonProps}>
            <RadarChart>
              <PolarGrid stroke="rgba(0,0,0,0.1)" />
              <PolarAngleAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fontSize: 10 }} />
              <Radar
                name={dataKey}
                dataKey={dataKey}
                stroke={color}
                fill={`${color}20`}
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={animated ? 1000 : 0}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const cardVariants = {
    default: {
      background: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    glassmorphism: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    minimal: {
      background: 'transparent',
      border: '1px solid',
      borderColor: 'divider',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card sx={cardVariants[variant]}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              {trend && (
                <Chip
                  icon={trend.direction === 'up' ? <TrendingUp /> : <TrendingDown />}
                  label={`${trend.value > 0 ? '+' : ''}${trend.value}% ${trend.label}`}
                  color={trend.direction === 'up' ? 'success' : 'error'}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          }
          subheader={subtitle}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {onRefresh && (
                <IconButton onClick={onRefresh} size="small">
                  <Refresh />
                </IconButton>
              )}
              <IconButton onClick={() => setIsFullscreen(!isFullscreen)} size="small">
                <Fullscreen />
              </IconButton>
              <IconButton onClick={handleMenuOpen} size="small">
                <MoreVert />
              </IconButton>
            </Box>
          }
          sx={{ pb: 1 }}
        />
        
        <CardContent sx={{ pt: 0 }}>
          {renderChart()}
        </CardContent>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleExport('png')}>
            <Download sx={{ mr: 1 }} fontSize="small" />
            Export as PNG
          </MenuItem>
          <MenuItem onClick={() => handleExport('svg')}>
            <Download sx={{ mr: 1 }} fontSize="small" />
            Export as SVG
          </MenuItem>
          <MenuItem onClick={() => handleExport('pdf')}>
            <Download sx={{ mr: 1 }} fontSize="small" />
            Export as PDF
          </MenuItem>
          <MenuItem onClick={() => handleExport('csv')}>
            <Download sx={{ mr: 1 }} fontSize="small" />
            Export as CSV
          </MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
};
