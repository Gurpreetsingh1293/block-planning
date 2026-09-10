import React from 'react';
import Card from '../common/Card';
import { Clock, Navigation, Calendar, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeatureCard({ id, title, description, linkTo, icon: Icon, badge }) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      className="feature-operational-card"
      onClick={() => linkTo && navigate(linkTo)}
    >
      <div className="feature-card-header">
        <div className="feature-icon-box">
          {Icon && <Icon size={22} />}
        </div>
        {badge && <span className="feature-card-badge">{badge}</span>}
      </div>

      <div className="feature-card-body">
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-desc">{description}</p>
      </div>

      <div className="feature-card-footer">
        <span className="feature-open-text">Access View</span>
        <ArrowUpRight size={16} className="feature-arrow-icon" />
      </div>
    </Card>
  );
}
