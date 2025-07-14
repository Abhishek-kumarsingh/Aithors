"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Refresh,
  TrendingUp,
  Assessment,
  Timeline,
  BarChart,
  PieChart,
  ShowChart,
  Fullscreen
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion } from 'framer-motion';

interface ChartData {
  [key: string]: any;
}

interface PerformanceChartProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
  chartType: 'line' | 'area' | 'bar' | 'pie' | 'radar';
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  colors?: string[];
  height?: number;
  loading?: boolean;
  onRefresh?: () => void;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  showLegend?: boolean;
  showGrid?: boolean;
  variant?: 'default' | 'minimal' | 'detailed';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const timeRangeOptions = [
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '3 Months' },
  { value: '365', label: '1 Year' }
];

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title,
  subtitle,
  data,
  chartType,
  dataKey,
  xAxisKey = 'name',
  color = '#3b82f6',
  colors = COLORS,
  height = 300,
  loading = false,
  onRefresh,
  timeRange,
  onTimeRangeChange,
  showLegend = true,
  showGrid = true,
  variant = 'default'
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderChart = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!data || data.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height, flexDirection: 'column' }}>
          <Assessment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No data available
          </Typography>
        </Box>
      );
    }

    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <RechartsTooltip />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <RechartsTooltip />
              {showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart {...commonProps}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <RechartsTooltip />
              {showLegend && <Legend />}
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey={dataKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
              {showLegend && <Legend />}
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey={xAxisKey} />
              <PolarRadiusAxis />
              <Radar
                name={dataKey}
                dataKey={dataKey}
                stroke={color}
                fill={color}
                fillOpacity={0.3}
              />
              <RechartsTooltip />
            </RadarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartIcon = () => {
    switch (chartType) {
      case 'line': return <ShowChart />;
      case 'area': return <Timeline />;
      case 'bar': return <BarChart />;
      case 'pie': return <PieChart />;
      case 'radar': return <Assessment />;
      default: return <TrendingUp />;
    }
  };

  const cardStyles = variant === 'minimal' ? {
    boxShadow: 'none',
    border: '1px solid',
    borderColor: 'divider'
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', ...cardStyles }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getChartIcon()}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            </Box>
          }
          subheader={subtitle}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {timeRange && onTimeRangeChange && (
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <Select
                    value={timeRange}
                    onChange={(e) => onTimeRangeChange(e.target.value)}
                    variant="outlined"
                  >
                    {timeRangeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              
              {onRefresh && (
                <Tooltip title="Refresh">
                  <IconButton onClick={onRefresh} disabled={loading}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Fullscreen">
                <IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
                  <Fullscreen />
                </IconButton>
              </Tooltip>
            </Box>
          }
          sx={{ pb: 1 }}
        />
        
        <CardContent sx={{ pt: 0 }}>
          {/* Chart Stats */}
          {variant === 'detailed' && data && data.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Chip
                label={`${data.length} data points`}
                size="small"
                color="primary"
                variant="outlined"
              />
              {chartType === 'line' || chartType === 'area' ? (
                <Chip
                  label={`Trend: ${data[data.length - 1]?.[dataKey] > data[0]?.[dataKey] ? 'Increasing' : 'Decreasing'}`}
                  size="small"
                  color={data[data.length - 1]?.[dataKey] > data[0]?.[dataKey] ? 'success' : 'error'}
                  variant="outlined"
                />
              ) : null}
            </Box>
          )}
          
          {/* Chart */}
          <Box sx={{ width: '100%', height: isFullscreen ? '70vh' : height }}>
            {renderChart()}
          </Box>
          
          {/* Additional Info */}
          {variant === 'detailed' && data && data.length > 0 && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {new Date().toLocaleString()}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
