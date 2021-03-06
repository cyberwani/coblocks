/**
 * External dependencies
 */
import get from 'lodash/get';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './styles/editor.scss';
import './styles/style.scss';
import ClickToTweet from './components/click-to-tweet';
import ClicktoTweetBlock from './components/edit';
import icons from './components/icons';
import FONT_SIZES from './components/font-sizes';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { withFallbackStyles } = wp.components;
const { RichText, getColorClass } = wp.editor;

/**
 * Block registration
 */
registerBlockType( 'coblocks/click-to-tweet', {

	title: __( 'Click to Tweet' ),

	description: __( 'Add a quote for readers to tweet via Twitter.' ),

	icon: 'twitter',

	category: 'common',

	keywords: [
		__( 'social' ),
		__( 'twitter' ),
		__( 'coblocks' ),
	],

	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: 'p',
			default: [],
		},
		url: {
			type: 'attribute',
		},
		textAlign: {
			type: 'string',
		},
		via: {
			type: 'string',
		},
		buttonText: {
			type: 'string',
			default: __( 'Click to Tweet' ),
		},
		buttonColor: {
			type: 'string',
		},
		textColor: {
			type: 'string',
		},
		customButtonColor: {
			type: 'string',
		},
		customTextColor: {
			type: 'string',
		},
		fontSize: {
			type: 'string',
		},
		customFontSize: {
			type: 'number',
		},
	},

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'coblocks/click-to-tweet', { content: content } );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/quote' ],
				transform: ( { value, citation } ) => {
					// transforming an empty click to share element
					if ( ( ! value || ! value.length ) && ! citation ) {
						return createBlock( 'coblocks/click-to-tweet' );
					}
					// transforming a click to share element with content
					return ( value || [] ).map( item => createBlock( 'coblocks/click-to-tweet', {
						content: [ get( item, 'children.props.children', '' ) ],
					} ) ).concat( citation ? createBlock( 'core/paragraph', {
						content: citation,
					} ) : [] );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/pullquote' ],
				transform: ( { value, citation } ) => {
					// transforming an empty click to share element
					if ( ( ! value || ! value.length ) && ! citation ) {
						return createBlock( 'coblocks/click-to-tweet' );
					}
					// transforming a click to share element with content
					return ( value || [] ).map( item => createBlock( 'coblocks/click-to-tweet', {
						content: [ get( item, 'children.props.children', '' ) ],
					} ) ).concat( citation ? createBlock( 'core/paragraph', {
						content: citation,
					} ) : [] );
				},
			},
			{
				type: 'block',
				blocks: [ 'coblocks/click-to-share' ],
				transform: ( { content } ) => {
					// transforming an empty click to share element
					if ( ! content || ! content.length ) {
						return createBlock( 'coblocks/click-to-tweet' );
					}
					// transforming a click to share element with content
					return ( content || [] ).map( item => createBlock( 'coblocks/click-to-tweet', {
						content: content,
					} ) );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					// transforming an empty click to share element
					if ( ! content || ! content.length ) {
						return createBlock( 'core/paragraph' );
					}
					// transforming a click to share element with content
					return ( content || [] ).map( item => createBlock( 'core/paragraph', {
						content: content,
					} ) );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/quote' ],
				transform: ( { content } ) => {
					// transforming a click to share element with content
					return createBlock( 'core/quote', {
						value: [
							{ children: <p key="1">{ content }</p> },
						],
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/pullquote' ],
				transform: ( { content } ) => {
					// transforming a click to share element with content
					return createBlock( 'core/pullquote', {
						value: [
							{ children: <p key="1">{ content }</p> },
						],
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'coblocks/click-to-share' ],
				transform: ( { content } ) => {
					// transforming an empty click to share element
					if ( ! content || ! content.length ) {
						return createBlock( 'coblocks/click-to-share' );
					}
					// transforming a click to share element with content
					return ( content || [] ).map( item => createBlock( 'coblocks/click-to-share', {
						content: content,
					} ) );
				},
			},
		],
	},

	edit: ClicktoTweetBlock,

	save: function( props ) {

		const {
			buttonColor,
			buttonText,
			customButtonColor,
			customTextColor,
			content,
			customFontSize,
			fontSize,
			textColor,
			url,
			via,
		} = props.attributes;

		const viaUrl = via ? `&via=${via}` : '';

		const tweetUrl = `http://twitter.com/share?&text=${ encodeURIComponent( content ) }&url=${url}${viaUrl}`;

		const fontSizeClass = fontSize && `is-${ fontSize }-text`;

		const textColorClass = getColorClass( 'color', textColor );

		const textClasses = classnames( 'wp-block-coblocks-click-to-tweet__text', {
			'has-text-color': textColor || customTextColor,
			[ fontSizeClass ]: fontSizeClass,
			[ textColorClass ]: textColorClass,
		} );

		const textStyles = {
			fontSize: fontSizeClass ? undefined : customFontSize,
			color: textColorClass ? undefined : customTextColor,
		};

		const buttonColorClass = getColorClass( 'background-color', buttonColor );

		const buttonClasses = classnames( 'wp-block-coblocks-click-to-tweet__twitter-btn', {
			'has-button-color':  buttonColor || customButtonColor,
			[ buttonColorClass ]: buttonColorClass,
		} );

		const buttonStyles = {
			backgroundColor: buttonColorClass ? undefined : customButtonColor,
		};

		if ( content && content.length > 0 ) {
			return (
				<ClickToTweet { ...props }>

					<RichText.Content
						tagName="p"
						className={ textClasses }
						style={ textStyles }
						value={ content }
					/>

					<RichText.Content
						tagName="a"
						className={ buttonClasses }
						style={ buttonStyles }
						value={ buttonText }
						href={ tweetUrl }
						target="_blank"
					/>

				</ClickToTweet>
			);
		}

		return null;
	},
} );
